import { Box, Card, Modal, Skeleton } from '@mui/material'
import YouTube, { YouTubeEvent } from 'react-youtube'
import React, { useEffect, useRef, useState } from 'react'
import CardMeta from './CardMeta'

const YoutubePlayerWrapper = ({ id }: { id: string }) => {
  const [timeWatched, setTimeWatched] = useState(0)
  const intervalRef = useRef(null)
  const playerRef = useRef(null)

  const [ready, setReady] = React.useState<boolean>(false)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const currentTimeWatched = localStorage.getItem('totalTimeWatched') ?? 0
    const newTimeWatched = Number(currentTimeWatched) + timeWatched
    localStorage.setItem('totalTimeWatched', String(newTimeWatched))
  }, [timeWatched])

  const onReady = (evt: YouTubeEvent) => {
    console.log('onReady')
    setReady(true)
    playerRef.current = evt.target // Save the player reference on ready
  }
  const onPlay = (evt: YouTubeEvent) => {
    console.log('onReady')
  }
  const onPause = (evt: YouTubeEvent) => {
    console.log('onReady')
  }
  const onEnd = (evt: YouTubeEvent) => {
    console.log('onReady')
  }

  const onStateChange = (evt: YouTubeEvent) => {
    console.log('State Change Event:', evt)
    if (evt.data === YouTube.PlayerState.PLAYING && !intervalRef.current) {
      // @todo clean this up, but not worth it now, not sure if this is how
      // the mechanism will end up

      // @ts-ignore
      intervalRef.current = setInterval(() => {
        // @ts-ignore
        const currentTime = playerRef.current.getCurrentTime()
        setTimeWatched(currentTime)
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
        sx={{ opacity: ready ? 1 : 0, position: ready ? 'auto' : 'absolute' }}
      >
        <YouTube
          videoId={id}
          id={id}
          className={'youtube-wrapper'}
          iframeClassName={'youtube-iframe-wrapper'}
          title={'nto sure if we need this yet'}
          // loading={string}
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
        {ready && <CardMeta />}
      </Box>
    </>
  )
}
export default YoutubePlayerWrapper
