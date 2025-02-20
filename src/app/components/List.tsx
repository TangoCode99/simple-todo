'use client';
import { useState } from 'react';
import { Task } from '../types/task';
import Modal from './Modal';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

type ListProps = {
    title: string;
    tasks: Task[]; // Expect an array of Task objects
  };

  export default function List({ title, tasks }: ListProps) {
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

    const [taskName, setTaskName] = useState("");

    const handleAddTask = () => {
        if (!taskName.trim()) return;
        console.log("Task Added:", taskName);
        setTaskName(""); // Clear input
        setIsAddTaskModalOpen(false); // Close modal
    };

    return (
        <div className="bg-white rounded-md w-full h-full mx-4 text-black p-2 border-2">
            <div className='flex flex-row justify-between border-b items-center'>
                <h1 className="font-semibold mb-1 text-2xl">{title}</h1>
                {title == 'Tasks' ? <button onClick={() => setIsAddTaskModalOpen(true)}><AddIcon /></button> : ''}
            </div>
            <div className="flex flex-col divide-y divide-gray-200">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task.id} className="flex flex-row group justify-between items-center my-1">
                            <div>
                                <h3>{task.title}</h3>
                                <p className="text-xs text-gray-400">Due on {task.dueDate}</p>
                            </div>
                            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                <button>
                                    <EditIcon fontSize='small' />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
                {/* <div className="flex flex-row group justify-between items-center my-1">
                    <div>
                        <h3>Task One</h3>
                        <p className="text-xs text-gray-400">Due on March 5, 2024</p>
                    </div>
                    <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                        <button>
                            <EditIcon fontSize='small' />
                        </button>
                    </div>
                </div>
                <div className="my-1">
                    <h3>Task Two</h3>
                    <p className="text-xs text-gray-400">Due on April 5, 2024</p>
                </div>
                <div className="my-1">
                    <h3>Task Three</h3>
                    <p className="text-xs text-gray-400">Due on May 5, 2024</p>
                </div> */}
            </div>
            <Modal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)} title="Add Task">
                <input
                    type="text"
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Enter task name..."
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddTask(); // Submit with Enter
                    }}
                />
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 bg-gray-400 text-white rounded mr-2"
                        onClick={() => setIsAddTaskModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleAddTask}>
                        Save Task
                    </button>
                </div>
            </Modal>
        </div>
    );
}