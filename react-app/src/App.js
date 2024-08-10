import React from 'react'
import './App.css'

import MainFeed from './components/MainFeed.js'
import Header from './components/Header.js'
import { useQuery } from 'react-query'
import { fetchTestData } from './api/api-calls'
import StyleExamples from "./components/examples/StyleExamples"

function App() {
  const { data, error, isError, isLoading } = useQuery(
    'testData',
    fetchTestData
  )

  if (isLoading) {
    console.error('loading')
    // don't block rendering for now but use this pattern in sub components to show
    // render blocking API requests
  }

  if (isError) {
    console.error('Error fetching data', error)
    // don't block rendering for now
    // return <div>Error fetching data</div>;
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
