import React, { useEffect } from 'react'
import './App.css'

import MainFeed from './components/MainFeed'
import Header from './components/Header'
import Co2CounterWidget from './components/widget/Co2CounterWidget'
import { VideoOpenProvider } from './context/context'

const apiHost = process.env.REACT_APP_BACKEND_HOST ?? 'http://127.0.0.1:5000/'

function App() {
  useEffect(() => {
    fetch(`${apiHost}/yt/fc?ids=bNH16A4f5Yk`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

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
