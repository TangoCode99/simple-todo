import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: number } }) {
  try {
    const { title, dueDate, status } = await req.json();
    const updatedTask = await prisma.task.update({
      where: { id: params.id },
      data: { title, dueDate, status },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
