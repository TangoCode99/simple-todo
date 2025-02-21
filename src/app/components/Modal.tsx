import React, { useState, useEffect } from "react";
import { Task } from "../types/task";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  initialTask?: Task | null;
}

export default function Modal({ isOpen, onClose, onSave, initialTask }: TaskModalProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || "");
  const [status, setStatus] = useState(initialTask?.status || "pending");

  // Populate form when editing a task
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setStatus(initialTask.status);
      const dueDate = initialTask.dueDate ? new Date(initialTask.dueDate) : null;
      if (dueDate) {
        const utcDate = dueDate.toISOString().split("T")[0];  // YYYY-MM-DD
        setDueDate(utcDate);
      }
    } else {
      setTitle("");
      setDueDate("");
      setStatus("pending");
    }
  }, [initialTask]);

  const handleSave = () => {
    if (!title.trim()) return alert("Task title is required!");

    onSave({ title, dueDate, status });
    onClose(); // Close modal after saving
  };

  // Close modal when "Escape" key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96 transition-transform duration-300 transform scale-95 animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center text-black mb-4">
          <h2 className="text-lg">
            {initialTask ? "Edit Task" : "Add Task"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✖
          </button>
        </div>
        <div className="rounded w-full text-black">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "pending" | "in-progress" | "completed")}
            className="border p-2 rounded w-full mb-4"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="bg-gray-300 p-2 rounded">
              Cancel
            </button>
            <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">
              {initialTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};