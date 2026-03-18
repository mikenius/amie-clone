import React, { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { TaskItem } from './TaskItem'
import { AddTask } from './AddTask'

export const TaskList: React.FC = () => {
  const { tasks, isLoading, fetchTasks } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Tasks</h2>
      </div>
      <div className="task-list-scroll scroll-area">
        {isLoading ? (
          <p className="placeholder-text">Loading...</p>
        ) : tasks.length === 0 ? (
          <p className="placeholder-text">No tasks yet. Add one below!</p>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
      <div className="task-list-footer">
        <AddTask />
      </div>
    </div>
  )
}
