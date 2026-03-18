import { useEffect, useState } from 'react'

function App() {
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    // electronAPIが存在する場合（Electron環境）のみ実行
    if (window.electronAPI) {
      window.electronAPI.getVersion().then(setVersion)
    } else {
      setVersion('Web Dev Mode')
    }
  }, [])

  return (
    <>
      {/* Titlebar draggable region */}
      <div className="titlebar-drag-region" />
      
      <div className="app-container">
        {/* Left Pane: Tasks (P1-03) */}
        <div className="sidebar">
          <div className="sidebar-header">
            Tasks
          </div>
          <div className="scroll-area">
            <p className="placeholder-text">
              Task list will be implemented here (P1-03)
            </p>
            {version && (
              <p className="placeholder-text" style={{ marginTop: '20px', fontSize: '0.8rem' }}>
                App Version: {version}
              </p>
            )}
          </div>
        </div>

        {/* Right Pane: Calendar (P1-04) */}
        <div className="main-content">
          <div className="main-header">
            Calendar
          </div>
          <div className="scroll-area">
            <p className="placeholder-text">
              Weekly calendar will be implemented here (P1-04)
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
