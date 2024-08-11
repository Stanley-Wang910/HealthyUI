import React, { useState, useEffect } from 'react'
import { ReactComponent as PaintIcon } from '../icons/asdfasd-icon.svg'
import useLocalStorageObserver from '../hooks/useLocalStorageObserver'
import { Box } from '@mui/material' // Assuming you have an Icon component

// @todo once we have a more developed model, we will feed the total time watched into
// some kind of algo to get back a 'tree count'
// for new we're assigning an arbitrary value
// dividing the total time watched by the arbitrary value and then displaying a certain number of trees
// i.e. total time / Co2Constant = number of icons to display
// this is just for quick demo purpose
const CO2_CONSTANT = 50

const calcTreesToDisplay = (totalTime: number) => {
  return Math.round(totalTime / CO2_CONSTANT)
}

const Co2CounterWidget = () => {
  const [numberTrees, setNumberTrees] = useState(100) // This number will be updated somehow

  const [value, setValue] = useLocalStorageObserver<string>(
    'totalTimeWatched',
    '0'
  )

  useEffect(() => {
    console.log(value)
  }, [value])

  // Let's assume the number updates from some external event
  useEffect(() => {
    const interval = setInterval(() => {
      const totalTime = Number(localStorage.getItem('totalTimeWatched') ?? 0)
      const numTrees = calcTreesToDisplay(totalTime)
      setNumberTrees(numTrees) // Increment number every second
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {Array.from({ length: numberTrees }, (_, index) => (
        <Box
          sx={{
            width: '50px'
          }}
        >
          <PaintIcon key={index} />
        </Box>
      ))}
    </>
  )
}

export default Co2CounterWidget
