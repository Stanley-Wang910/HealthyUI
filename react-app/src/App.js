import React from 'react'
import './App.css'

import MainFeed from './components/MainFeed'
import Header from './components/Header'
import Co2CounterWidget from './components/widget/Co2CounterWidget'
import { VideoOpenProvider } from './context/context'
import FactCheck from './components/FactCheck'
import { useQuery } from '@tanstack/react-query'

import { fetchNewsFactCheck } from './api/api-calls'

function App() {
  const videoId = 'bNH16A4f5Yk'
  console.log('videoId', videoId)
  const { data, isLoading, error } = useQuery({
    queryKey: ['fetchNewsFactCheck', videoId],
    queryFn: async () => {
      const result = fetchNewsFactCheck(videoId)
      console.log('Fact check result:', result)
      return result
    },
    enabled: true,
    retry: 3
  })

  return (
    <>
      <VideoOpenProvider>
        <Header />
        <Co2CounterWidget />
        <MainFeed />
        <FactCheck factCheckData={data} isLoading={isLoading} error={error} />
      </VideoOpenProvider>
    </>
  )
}

export default App
