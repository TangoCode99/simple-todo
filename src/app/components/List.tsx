'use client';
import { Task } from '../types/task';
import EditIcon from '@mui/icons-material/Edit';
import { MONTHS } from '../util/dateUtils';

type ListProps = {
    title: string;
    tasks: Task[]; // Expect an array of Task objects
    onEdit: (task: Task) => void;
};

function parseDate(newDate: string) {
    const currentTime = new Date();
    const taskDate = new Date(newDate);

    if (currentTime > taskDate) {
        return (
            <div className='text-red-600'>OVERDUE ({MONTHS[taskDate.getMonth()]} {taskDate.getDate()})</div>
        );
    }

    return (
        <div>
            Due on {MONTHS[taskDate.getMonth()]} {taskDate.getDate() + 1}, {taskDate.getFullYear()}
        </div>
    );

}

export default function List({ title, tasks, onEdit }: ListProps) {
    return (
        <div className="bg-white rounded-md w-full h-full mx-4 text-black p-2 border-2">
            <div className='flex flex-row justify-between border-b items-center'>
                <h1 className="font-semibold mb-1 text-2xl">{title}</h1>
            </div>
            <div className="flex flex-col divide-y divide-gray-200">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task.id} className="flex flex-row group justify-between items-center my-1">
                            <div>
                                <h3>{task.title}</h3>
                                {task.status != "completed" ? <div className="text-xs text-gray-400">{parseDate(task.dueDate!)}</div> : ""}
                            </div>
                            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                                <button onClick={() => onEdit(task)}>
                                    <EditIcon fontSize='small' />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </div>
        </div>
    );
}