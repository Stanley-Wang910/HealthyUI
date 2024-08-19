import React, { useContext, useState } from 'react'
import '../styles/MainFeed.css'

import { VideoType } from '../api/dto'
import { useQuery } from '@tanstack/react-query'
import YoutubePlayerWrapper from './VideoPlayer'
import { Grid, Modal, Skeleton } from '@mui/material'
import VideoOpenContext from '../context/context'
import { fetchNewsFactCheck, fetchVideosById } from '../api/api-calls'
import VideoBlock from './VideoBlock'

const MainFeed = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [videoId, setVideoId] = useState<string>('')
  const [meta, setVideoMeta] = useState<VideoType['huiMeta']>()
  const { value, updateValue } = useContext(VideoOpenContext)

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['fetchVideosById'],
    queryFn: () => fetchVideosById()
  })

  const handleClick = (id: string, huiMeta: VideoType['huiMeta']) => {
    setVideoId(id)
    setVideoMeta(huiMeta)
    handleOpen()
  }

  const handleOpen = () => {
    setOpen(true)
    updateValue(true)
  }

  const handleClose = () => {
    setOpen(false)
    updateValue(false)
  }

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }, (_, index) => (
          <Grid item xs={4}>
            <Skeleton variant={'rectangular'} height={'241px'} />
            <Skeleton
              variant={'rectangular'}
              height={'20px'}
              sx={{ marginTop: '20px' }}
            />
            <Skeleton
              variant={'rectangular'}
              height={'10px'}
              sx={{ marginTop: '20px' }}
            />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (isError) {
    console.error('Error fetching data', error)
    return <div>error</div>
  }

  if (!isLoading && !data.length) {
    return (
      <Grid container spacing={3} className="px-4">
        <Grid item xs={12}>
          <p>No videos available.</p>
        </Grid>
      </Grid>
    )
  }

  return (
    <>
      <Grid container spacing={2} className='px-4'>
        {data.map((item: VideoType, index: number) => {
          return (
            <Grid item xs={4}>
              <div style={{ cursor: 'pointer' }}>
                <VideoBlock
                  key={item.id}
                  id={item.id}
                  videoThumbnail={item.snippet.thumbnails.high.url}
                  profileThumbnail={item.snippet.thumbnails.medium.url}
                  title={item.snippet.title}
                  author={item.snippet.channelTitle}
                  date={new Date(item.snippet.publishedAt).toLocaleDateString()}
                  huiMeta={item.huiMeta}
                  stats={item.statistics}
                  onClick={handleClick}
                />
              </div>
            </Grid>
          )
        })}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          p: 3
        }}
      >
        <YoutubePlayerWrapper id={videoId} meta={meta} />
      </Modal>
    </>
  )
}

export default MainFeed
