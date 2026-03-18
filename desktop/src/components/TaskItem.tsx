import React from 'react'
import { Task, useTaskStore } from '../store/useTaskStore'
import { useDraggable } from '@dnd-kit/core'

interface TaskItemProps {
  task: Task
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  } : undefined

  return (
    <div 
      ref={setNodeRef} 
      className={`task-item ${task.status === 1 ? 'completed' : ''}`}
      style={style}
      {...listeners} 
      {...attributes}
    >
      <input
        type="checkbox"
        checked={task.status === 1}
        onChange={(e) => {
          e.stopPropagation()
          toggleTask(task.id)
        }}
        className="task-checkbox"
      />
      <span className="task-title">{task.title}</span>
      <button 
        className="task-delete-btn no-drag" 
        onClick={(e) => {
          e.stopPropagation()
          deleteTask(task.id)
        }}
        title="Delete task"
      >
        ×
      </button>
    </div>
  )
}
