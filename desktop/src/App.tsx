import { useEffect } from 'react'
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { TaskList } from './components/TaskList'
import { Calendar } from './components/Calendar'

function App() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const dropData = over.data.current as { date: Date; hour: number }
    
    if (dropData) {
      const startTime = new Date(dropData.date)
      startTime.setHours(dropData.hour, 0, 0, 0)
      
      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + 1) // Default 1 hour duration

      try {
        const success = await window.electronAPI.createEventFromTask(
          taskId, 
          startTime.toISOString(), 
          endTime.toISOString()
        )
        if (success) {
          // Refresh both stores to show the change
          const taskStore = (await import('./store/useTaskStore')).useTaskStore
          const eventStore = (await import('./store/useEventStore')).useEventStore
          taskStore.getState().fetchTasks()
          eventStore.getState().fetchEvents()
        }
      } catch (error) {
        console.error('Failed to create event from task:', error)
      }
    }
  }

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getVersion().then((v) => console.log('App Version:', v))
    }
  }, [])

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="app-container">
        {/* Left Pane: Tasks (P1-03) */}
        <div className="sidebar">
          <TaskList />
        </div>

        {/* Right Pane: Calendar (P1-04) */}
        <div className="main-content">
          <Calendar />
        </div>
      </div>
    </DndContext>
  )
}

export default App
