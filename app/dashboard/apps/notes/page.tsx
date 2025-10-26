import { generateMeta } from "@/lib/utils";
import NotesApp from "@/app/dashboard/apps/notes/note-app";

export async function generateMetadata() {
  return generateMeta({
    title: "Note App",
    description:
      "Professional note-taking application for adding, organizing and managing notes efficiently. Built with Hypelive, Next.js and Tailwind CSS.",
    canonical: "/apps/notes"
  });
}

export default function Page() {
  return <NotesApp />;
}
