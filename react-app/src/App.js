import React from 'react'
import './App.css'

import MainFeed from './components/MainFeed'
import Header from './components/Header'
import Co2CounterWidget from './components/widget/Co2CounterWidget'

function App() {
  return (
    <>
      <Header />
      <Co2CounterWidget />
      <MainFeed />
    </>
  )
}

export default App
