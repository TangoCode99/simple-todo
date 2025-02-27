"use client"
import { useEffect, useState } from "react";
import List from "./components/List";
import Modal from "./components/Modal";
import { MONTHS, WEEKDAYS } from "./util/dateUtils";

const date = new Date();

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

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

  // Open up delete confirmation modal.
  const handleDeleteTask = (task: Task) => {
    setShowDeleteModal(true);
    setDeleteTask(task);
  };

  // Calls the backend api call.
  const handlePermanentDelete = async (taskId: number) => {
    try {
      const res = await fetch(`/api/task/${taskId}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      console.log("Task deleted from database");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShowDeleteModal(false);
      fetchTasks();
    }
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="justify-items-center w-auto">
      <h1 className="py-4 mt-2 text-3xl font-bold border-b-2">Welcome, Tango! Today is {WEEKDAYS[date.getDay()]}, {MONTHS[date.getMonth()]} {date.getDate()}.</h1>
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
            title="Pending"
            tasks={pendingTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setModalOpen(true);
            }}
            deleteTask={(task) => {
              handleDeleteTask(task)
            }}
          />
          <List
            title="In-Progress"
            tasks={inProgressTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setModalOpen(true);
            }}
            deleteTask={handleDeleteTask}
          />
          <List
            title="Completed"
            tasks={completedTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setModalOpen(true);
            }}
            deleteTask={handleDeleteTask}
          />
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 transition-transform duration-300 transform scale-95 animate-fade-in">
            <div className="flex justify-between items-center text-black mb-4">
              <h2>Are you sure you want to delete this task?</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-800">
                ✖
              </button>
            </div>
            <div className="text-black italic my-2">
              <span>- {deleteTask?.title} -</span>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-300 p-1 rounded">
                Cancel
              </button>
              <button onClick={() => handlePermanentDelete(deleteTask!.id)} className="bg-red-500 text-white p-1 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
