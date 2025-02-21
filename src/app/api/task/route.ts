import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, dueDate, status } = body;

    if (!title || !dueDate || !status) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Convert date to ISO 8601
    const formattedDate = new Date(dueDate).toISOString();

    const newTask = await prisma.task.create({
      data: {
        title,
        dueDate: formattedDate, // Store as ISO format
        status,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}