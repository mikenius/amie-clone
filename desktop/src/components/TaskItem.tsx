import React from 'react'
import { Task, useTaskStore } from '../store/useTaskStore'

interface TaskItemProps {
  task: Task
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  return (
    <div className={`task-item ${task.status === 1 ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.status === 1}
        onChange={() => toggleTask(task.id)}
        className="task-checkbox"
      />
      <span className="task-title">{task.title}</span>
      <button 
        className="task-delete-btn no-drag" 
        onClick={() => deleteTask(task.id)}
        title="Delete task"
      >
        ×
      </button>
    </div>
  )
}
