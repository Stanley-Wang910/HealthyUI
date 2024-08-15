import { Box, Skeleton } from '@mui/material'
import YouTube, { YouTubeEvent } from 'react-youtube'
import React, { useEffect, useRef, useState } from 'react'
import { VideoType } from '../api/dto'
import CardMeta from './widget/CardMeta'

// type VideoItem = VideoType[string]['items'][0]
// type FactCheckData = any

const YoutubePlayerWrapper = ({
  id,
  meta
  // factcheckData
}: {
  id: string
  meta?: VideoType['huiMeta']
}) => {
  const [timeWatched, setTimeWatched] = useState(0)
  const intervalRef = useRef(null)
  const playerRef = useRef(null)
  const prevTimeRef = useRef(0) // Use a ref here

  const [ready, setReady] = React.useState<boolean>(false)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const totalTimeWatched = localStorage.getItem('totalTimeWatched') ?? 0
    const newTimeWatched = Number(totalTimeWatched) + timeWatched
    localStorage.setItem('totalTimeWatched', String(newTimeWatched))
  }, [timeWatched])

  const onReady = (evt: YouTubeEvent) => {
    console.log('ready')
    setReady(true)
    playerRef.current = evt.target // Save the player reference on ready
  }
  const onPlay = (evt: YouTubeEvent) => {
    console.log('play')
  }
  const onPause = (evt: YouTubeEvent) => {
    console.log('paused')
  }
  const onEnd = (evt: YouTubeEvent) => {
    console.log('ended')
  }

  const onStateChange = (evt: YouTubeEvent) => {
    console.log('State Change Event:', evt)
    if (evt.data === YouTube.PlayerState.PLAYING && !intervalRef.current) {
      // @ts-ignore
      intervalRef.current = setInterval(() => {
        // @ts-ignore
        const currentTime = playerRef.current?.getCurrentTime()
        const deltaTime = currentTime - prevTimeRef.current

        // quick fix for if user is skipping around on the video, 2 is arbitrary number
        // this mechanism could be cleaner
        prevTimeRef.current = currentTime
        if (deltaTime > 2) {
          return
        }
        setTimeWatched((prevTime) => prevTime + deltaTime)
      }, 1000)
    } else if (
      evt.data !== YouTube.PlayerState.PLAYING &&
      intervalRef.current
    ) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }
  const onPlaybackRateChange = (evt: YouTubeEvent) => {
    console.log('onReady')
  }
  const onPlaybackQualityChange = (evt: YouTubeEvent) => {
    console.log('onReady')
  }

  return (
    <>
      {!ready && (
        <Box>
          <Skeleton
            sx={{ bgcolor: 'grey.900' }}
            variant="rectangular"
            width={640}
            height={367}
          />
        </Box>
      )}

      <Box
        sx={{
          maxWidth: '650px',
          textAlign: 'center',
          opacity: ready ? 1 : 0,
          position: ready ? 'auto' : 'absolute'
        }}
      >
        <YouTube
          videoId={id}
          id={id}
          className={'youtube-wrapper'}
          iframeClassName={'youtube-iframe-wrapper'}
          title={'not sure if we need this yet'}
          opts={{
            enablejsapi: 1,
            rel: 0
          }}
          onReady={onReady}
          onPlay={onPlay}
          onPause={onPause}
          onEnd={onEnd}
          // onError={func}
          onStateChange={onStateChange}
          onPlaybackRateChange={onPlaybackRateChange}
          onPlaybackQualityChange={onPlaybackQualityChange}
        />
        {ready && meta && <CardMeta id={id} meta={meta} />}
      </Box>
    </>
  )
}
export default YoutubePlayerWrapper
