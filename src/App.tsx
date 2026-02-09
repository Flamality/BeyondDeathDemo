import React from 'react'
import './App.css'
import Engine from './engine/Engine'
import { ConsoleProvider } from './context/Console'
import Console from './components/Console/Console'

function App() {

  return (
    <>
    <ConsoleProvider>
      <Console />
      <Engine />
    </ConsoleProvider>
    </>
  )
}

export default App
