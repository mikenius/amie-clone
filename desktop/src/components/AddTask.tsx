import React, { useState } from 'react'
import { useTaskStore } from '../store/useTaskStore'

export const AddTask: React.FC = () => {
  const [title, setTitle] = useState('')
  const addTask = useTaskStore((state) => state.addTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      addTask(title.trim())
      setTitle('')
    }
  }

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="+ Add a task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="add-task-input"
      />
    </form>
  )
}
