/**
 * React Ref Composition Utilities
 *
 * Provides utilities for composing multiple React refs together. Useful when
 * you need to attach multiple refs to a single DOM element or React component.
 * Handles both callback refs and RefObject refs, with support for React 19
 * cleanup functions.
 *
 * @module lib/compose-refs
 *
 * @example
 * ```typescript
 * import { useComposedRefs } from '@/lib/compose-refs';
 *
 * function MyComponent() {
 *   const localRef = useRef<HTMLDivElement>(null);
 *   const forwardedRef = useRef<HTMLDivElement>(null);
 *   const composedRef = useComposedRefs(localRef, forwardedRef);
 *
 *   return <div ref={composedRef}>Both refs attached!</div>;
 * }
 * ```
 */

import * as React from "react";

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Sets a given ref to a given value, handling both callback and object refs.
 *
 * Safely assigns a value to any React ref type (callback ref or RefObject).
 * Supports React 19's cleanup function return from callback refs.
 *
 * @template T - Type of the element being referenced
 * @param ref - React ref (callback or RefObject) to update
 * @param value - Value to assign to the ref
 * @returns Cleanup function if callback ref returns one, otherwise undefined
 *
 * @example
 * ```typescript
 * // With callback ref
 * const callbackRef = (node: HTMLDivElement) => {
 *   console.log('Node attached:', node);
 * };
 * setRef(callbackRef, divElement);
 *
 * // With RefObject
 * const refObject = useRef<HTMLDivElement>(null);
 * setRef(refObject, divElement);
 * // refObject.current === divElement
 * ```
 *
 * @remarks
 * - Callback refs: Invokes the function with the value
 * - RefObject refs: Sets the .current property
 * - Null/undefined refs: Safely ignored
 * - React 19+: Supports cleanup functions from callback refs
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    return ref(value);
  }

  if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * Composes multiple refs into a single callback ref.
 *
 * Creates a callback ref that updates all provided refs when called.
 * Useful for components that need to forward refs while maintaining
 * internal refs. Supports React 19's cleanup functions.
 *
 * @template T - Type of the element being referenced
 * @param refs - Variable number of refs (callback or RefObject) to compose
 * @returns Single callback ref that updates all provided refs
 *
 * @example
 * ```typescript
 * // Compose refs in a forwarded ref component
 * const MyComponent = React.forwardRef<HTMLDivElement, Props>((props, forwardedRef) => {
 *   const internalRef = useRef<HTMLDivElement>(null);
 *   const composedRef = composeRefs(internalRef, forwardedRef);
 *
 *   useEffect(() => {
 *     // Can use internalRef here
 *     console.log(internalRef.current);
 *   }, []);
 *
 *   return <div ref={composedRef} />;
 * });
 *
 * // Compose multiple refs
 * const ref1 = useRef<HTMLDivElement>(null);
 * const ref2 = useRef<HTMLDivElement>(null);
 * const ref3 = useCallback((node: HTMLDivElement) => {
 *   console.log('Attached:', node);
 * }, []);
 *
 * const composed = composeRefs(ref1, ref2, ref3);
 * // <div ref={composed} /> updates all three refs
 * ```
 *
 * @remarks
 * React 19 Cleanup Support:
 * - If any callback ref returns a cleanup function, the composed ref
 *   will return a cleanup that calls all individual cleanups
 * - For React <19, no cleanup is returned to avoid console warnings
 * - RefObjects are set to null during cleanup
 */
function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    // React <19 will log an error to the console if a callback ref returns a
    // value. We don't use ref cleanups internally so this will only happen if a
    // user's ref callback returns a value, which we only expect if they are
    // using the cleanup functionality added in React 19.
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

/**
 * React hook that composes multiple refs with memoization.
 *
 * A memoized version of composeRefs that returns a stable callback ref.
 * Use this in React components to avoid unnecessary re-renders.
 *
 * @template T - Type of the element being referenced
 * @param refs - Variable number of refs (callback or RefObject) to compose
 * @returns Memoized callback ref that updates all provided refs
 *
 * @example
 * ```typescript
 * function MyComponent({ externalRef }: { externalRef?: Ref<HTMLDivElement> }) {
 *   const internalRef = useRef<HTMLDivElement>(null);
 *   const observerRef = useCallback((node: HTMLDivElement) => {
 *     if (node) {
 *       const observer = new ResizeObserver(handleResize);
 *       observer.observe(node);
 *       return () => observer.disconnect();
 *     }
 *   }, []);
 *
 *   const composedRef = useComposedRefs(internalRef, observerRef, externalRef);
 *
 *   return <div ref={composedRef}>Composed refs with cleanup!</div>;
 * }
 *
 * // Forwarding refs pattern
 * const MyInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
 *   const localRef = useRef<HTMLInputElement>(null);
 *   const composedRef = useComposedRefs(localRef, ref);
 *
 *   useEffect(() => {
 *     localRef.current?.focus();
 *   }, []);
 *
 *   return <input ref={composedRef} {...props} />;
 * });
 * ```
 *
 * @remarks
 * - Returns a stable reference between renders (memoized with useCallback)
 * - Only updates when the ref dependencies change
 * - Prevents unnecessary re-renders of children components
 * - Safe to use in dependency arrays of other hooks
 *
 * Performance:
 * - Memoized callback prevents child component re-renders
 * - Minimal overhead compared to manual ref composition
 * - Automatically handles cleanup on ref changes
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
