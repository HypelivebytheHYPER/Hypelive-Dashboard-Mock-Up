import React from "react";
import { generateMeta } from "@/lib/utils";
import { promises as fs } from "fs";
import path from "path";

import Tasks from "@/app/dashboard/apps/todo-list-app/tasks";

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/dashboard/apps/todo-list-app/data/tasks.json")
  );
  return JSON.parse(data.toString());
}

export async function generateMetadata() {
  return generateMeta({
    title: "Todo List App",
    description:
      "Professional to-do list application for organizing tasks, adding new items and viewing task details. Built with Hypelive, Next.js and Tailwind CSS.",
    canonical: "/apps/todo-list-app"
  });
}

export default async function Page() {
  const tasks = await getTasks();

  return <Tasks tasks={tasks} />;
}
