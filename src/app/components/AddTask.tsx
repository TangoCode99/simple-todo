import { useState } from "react"

export default function AddTask() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {isOpen && (
                <div className="">
                    <div className="">
                        <h2>Task Title</h2>
                        <p>Description of the task!</p>
                    </div>
                    <div className="">
                        <button>Cancel</button>
                        <button>Save</button>
                    </div>
                </div>
            )}
        </div>
    )
}