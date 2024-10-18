import React from 'react'
import './App.css'

// import MainFeed from './components/MainFeed'
// import Header from './components/Header'
// import Co2CounterWidget from './components/widget/Co2CounterWidget'
// import { VideoOpenProvider } from './context/context'

function App() {
  return (
    <>
      <VideoOpenProvider>
        <Header />
        <Co2CounterWidget />
        <MainFeed />
      </VideoOpenProvider>
    </>
  )
}

export default App
