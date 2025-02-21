"use client"
import { useEffect, useState } from "react";
import List from "./components/List";
import Modal from "./components/Modal";

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
];
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/task");
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSaveTask = async (task: Omit<Task, "id">) => {
    if (editingTask) {
      // Update existing task
      await fetch(`/api/task/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
    } else {
      // Add new task
      await fetch("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
    }

    fetchTasks();
    setModalOpen(false);
    setEditingTask(null);
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="justify-items-center w-auto">
      <h1 className="py-4 mt-2 text-3xl font-bold border-b-2">Welcome, Tango! Today is {weekday[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}.</h1>
      <h1 className="py-4 text-2xl font-semibold">Here is what you need to tackle today.</h1>
      <button onClick={() => setModalOpen(true)} className="absolute bottom-0 right-0 bg-white text-black font-bold p-3 rounded-full m-6">
        + Add Task
      </button>
      {loading ? (<div className="text-xl">Loading tasks... Please wait a moment.</div>) : (
        <div className="flex justify-evenly w-full">
          <Modal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setEditingTask(null);
            }}
            onSave={handleSaveTask}
            initialTask={editingTask}
          />
          <List
            title="🟡 Pending Tasks"
            tasks={pendingTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setModalOpen(true);
            }}
          />
          <List
            title="🔵 In-Progress Tasks"
            tasks={inProgressTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setModalOpen(true);
            }}
          />
          <List
            title="🟢 Completed Tasks"
            tasks={completedTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setModalOpen(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
