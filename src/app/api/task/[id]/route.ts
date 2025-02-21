import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // Await the Promise
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }

  const body = await request.json();
  const { title, dueDate, status } = body;

  if (!title || !dueDate || !status) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

   // Convert the due date to UTC before saving
   const utcDueDate = new Date(dueDate).toISOString(); // Converts to UTC

  try {
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        dueDate: utcDueDate,
        status,
      },
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}