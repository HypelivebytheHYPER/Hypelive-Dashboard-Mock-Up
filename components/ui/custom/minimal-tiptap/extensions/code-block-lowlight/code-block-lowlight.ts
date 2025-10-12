import { CodeBlockLowlight as TiptapCodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

export const CodeBlockLowlight = TiptapCodeBlockLowlight.extend({
  addOptions() {
    return {
      // Tiptap v3.x: parent options are automatically inherited
      lowlight: createLowlight(common),
      defaultLanguage: null,
      HTMLAttributes: {
        class: 'block-node'
      }
    }
  }
})

export default CodeBlockLowlight
