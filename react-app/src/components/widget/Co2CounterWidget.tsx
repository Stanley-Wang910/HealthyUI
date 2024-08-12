import React, { useState, useEffect } from 'react'
import { ReactComponent as PaintIcon } from '../../icons/asdfasd-icon.svg'
import useLocalStorageObserver from '../../hooks/useLocalStorageObserver'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box
} from '@mui/material'
import Button from '@mui/material/Button' // Assuming you have an Icon component

// @todo once we have a more developed model, we will feed the total time watched into
// some kind of algo to get back an 'icon count', using a tree right now, but that probably
// doesn't make sense
// for new we're assigning an arbitrary value
// dividing the total time watched by the arbitrary value and then displaying a certain number of trees
// i.e. total time / Co2Constant = number of icons to display
// this is just for quick demo purpose
const CO2_CONSTANT = 50

const calcTreesToDisplay = (totalTime: number) => {
  const fig = totalTime / CO2_CONSTANT
  return Number(fig.toFixed(3))
}

const Co2CounterWidget = () => {
  /*******************************************************
   * HOOKS
   *******************************************************/
  const [numberTrees, setNumberTrees] = useState(100) // This number will be updated somehow

  const [value, setValue] = useLocalStorageObserver<string>(
    'totalTimeWatched',
    '0'
  )

  useEffect(() => {
    console.log(value)
  }, [value])

  useEffect(() => {
    const interval = setInterval(() => {
      const totalTime = Number(localStorage.getItem('totalTimeWatched') ?? 0)
      setNumberTrees(calcTreesToDisplay(totalTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  /*******************************************************
   * RENDER
   *******************************************************/
  const fullTrees = Math.floor(numberTrees)
  const partialTreeVisibility = numberTrees % 1

  return (
    <>
      <Accordion>
        <AccordionSummary id="panel-header" aria-controls="panel-content">
          <Button variant="contained">Show Tree Counter</Button>
        </AccordionSummary>
        <AccordionDetails>
          {Array.from({ length: fullTrees }, (_, index) => (
            <Box
              key={index}
              sx={{
                width: '30px',
                display: 'inline-block'
              }}
            >
              <PaintIcon />
            </Box>
          ))}
          {partialTreeVisibility > 0 && (
            <Box
              sx={{
                width: '30px',
                display: 'inline-block',
                maskImage: `linear-gradient(to right, black ${partialTreeVisibility * 100}%, transparent ${partialTreeVisibility * 100}%)`,
                maskSize: 'cover'
              }}
            >
              <PaintIcon />
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default Co2CounterWidget
