import React from 'react'
import './App.css'

import MainFeed from './components/MainFeed'
import Header from './components/Header'
import { fetchTestData } from './api/api-calls'
import { useQuery } from '@tanstack/react-query'
import Co2CounterWidget from './components/widget/Co2CounterWidget'

function App() {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['testData'],
    queryFn: fetchTestData
  })

  if (isLoading) {
    console.error('loading')
    return <div>'loading'</div>
  }

  if (isError) {
    console.error('Error fetching data', error)
    return <div>'error'</div>
  }

  console.log(data)

  return (
    <div>
      <Header />
      <Co2CounterWidget />
      <MainFeed />
    </div>
  )
}

export default App
