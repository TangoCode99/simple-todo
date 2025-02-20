"use client"
import { useEffect, useState } from "react";
import List from "./components/List";

const date = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Define Task type
type Task = {
  id: number;
  title: string;
  dueDate?: string; // Optional
  status: "pending" | "in-progress" | "completed";
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("/api/task");
        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data: Task[] = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, []);

    // Filter tasks by status
    const pendingTasks = tasks.filter((task) => task.status === "pending");
    const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
    const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="justify-items-center w-auto">
      <h1 className="py-4 mt-2 text-3xl font-bold border-b-2">Welcome, Tango! Today is {weekday[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}.</h1>
      <h1 className="py-4 text-2xl font-semibold">Here is what you need to tackle today.</h1>
      <div className="flex justify-evenly w-full">
        <List title="Tasks" tasks={pendingTasks} />
        <List title="In-Progress" tasks={inProgressTasks} />
        <List title="Completed" tasks={completedTasks} />
      </div>
    </div>
  );
}
