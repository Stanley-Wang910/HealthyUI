import React from 'react'
import './App.css'

import MainFeed from './components/MainFeed'
import Header from './components/Header'
import { useQuery } from 'react-query'
import { fetchTestData } from './api/api-calls'

function App() {
  const { data, error, isError, isLoading } = useQuery(
    'testData',
    fetchTestData
  )

  if (isLoading) {
    console.error('loading')
    // don't block rendering for now but use this pattern in sub components to show
    // render blocking API requests
    return <div>'loading'</div>
  }

  if (isError) {
    console.error('Error fetching data', error)
    // don't block rendering for now
    // return <div>Error fetching data</div>;
    return <div>'error'</div>
  }

  console.log(data)

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* min-h-screen - app full height, flex-col - stack items vertically */}
      <Header />
      <MainFeed />
    </div>
  )
}

export default App
