import { useEffect } from 'react'
import { TaskList } from './components/TaskList'
import { Calendar } from './components/Calendar'

function App() {
  useEffect(() => {
    // electronAPIが存在する場合（Electron環境）のみ実行
    if (window.electronAPI) {
      window.electronAPI.getVersion().then((v) => console.log('App Version:', v))
    }
  }, [])

  return (
    <>
      {/* Titlebar draggable region */}
      <div className="titlebar-drag-region" />
      
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
    </>
  )
}

export default App
