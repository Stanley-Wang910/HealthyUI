import React from 'react'
import '../styles/MainFeed.css'

import { fetchUserVideos } from '../api/api-calls'
import { VideoType } from '../api/dto'
import { useQuery } from '@tanstack/react-query'
import YoutubePlayerWrapper from './VideoPlayer.tsx'
import { Box, Grid, Modal } from '@mui/material'

const MainFeed = () => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['fetchUserVideos'],
    queryFn: fetchUserVideos
  })
  const [open, setOpen] = React.useState<boolean>(false)
  const [videoId, setVideoId] = React.useState<string>('')

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  if (isLoading) {
    console.error('loading')
    // don't block rendering for now but use this pattern in sub components to show
    // render blocking API requests
    return <div>loading</div>
  }

  if (isError) {
    console.error('Error fetching data', error)
    // don't block rendering for now
    // return <div>Error fetching data</div>;
    return <div>error</div>
  }

  const VideoBlock = ({
    id,
    videoThumbnail,
    profileThumbnail,
    title,
    author,
    viewCount,
    date
  }: {
    id: string
    videoThumbnail: string
    profileThumbnail: string
    title: string
    author: string
    viewCount: string
    date: string
  }) => {
    return (
      <div
        className="preview"
        onClick={() => {
          setVideoId(id)
          setOpen(true)
        }}
      >
        <div className="thumbnail-row">
          <img className="thumbnail" src={videoThumbnail} alt="thumbnail" />
        </div>

        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={profileThumbnail} alt="channel" />
          </div>

          <div className="video-info">
            <p className="title">{title}</p>

            <p className="author">{author}</p>

            <p className="stats">
              {viewCount} &middot; {date}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Grid container spacing={2}>
        {data.map((item: VideoType, index: number) => {
          return (
            <Grid item xs={4}>
              <VideoBlock
                key={item.id}
                id={item.id}
                videoThumbnail={item.thumbnail}
                profileThumbnail={item.thumbnail}
                title={item.title}
                author={item.author}
                viewCount={item.views}
                date={item.date}
              />
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
        <YoutubePlayerWrapper id={videoId} />
      </Modal>
    </>
  )
}

export default MainFeed
