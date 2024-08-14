import React from 'react'
import '../styles/MainFeed.css'

import { fetchUserVideos } from '../api/api-calls'
import { VideoType } from '../api/dto'
import { useQuery } from '@tanstack/react-query'
import YoutubePlayerWrapper from './VideoPlayer'
import { Grid, Modal, Skeleton } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import CommentIcon from '@mui/icons-material/Comment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

const MainFeed = () => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['fetchUserVideos'],
    queryFn: () => fetchUserVideos('')
  })
  const [open, setOpen] = React.useState<boolean>(false)
  const [videoId, setVideoId] = React.useState<string>('')
  const [meta, setVideoMeta] = React.useState<VideoType['huiMeta']>()

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  if (isLoading) {
    // don't block rendering for now but use this pattern in sub components to show
    // render blocking API requests
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

  const VideoBlock = ({
    id,
    videoThumbnail,
    profileThumbnail,
    title,
    author,
    date,
    stats,
    huiMeta
  }: {
    id: string
    videoThumbnail: string
    profileThumbnail: string
    title: string
    author: string
    date: string
    stats: VideoType['youtubeStatistics']
    huiMeta: VideoType['huiMeta']
  }) => {
    return (
      <div
        className="preview"
        onClick={() => {
          setVideoId(id)
          setVideoMeta(meta)
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
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  alignItems: 'center'
                }}
              >
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <CommentIcon
                    sx={{
                      paddingRight: '10px'
                    }}
                  />
                  {stats.commentCount}
                </Grid>
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <CalendarMonthIcon
                    sx={{
                      paddingRight: '10px'
                    }}
                  />
                  {date}
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                  alignItems: 'center'
                }}
              >
                <Grid
                  item
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <VisibilityIcon
                    sx={{
                      paddingRight: '10px'
                    }}
                  />
                  {stats.viewCount}
                </Grid>

                <Grid
                  item
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ThumbUpIcon
                    sx={{
                      paddingRight: '10px'
                    }}
                  />
                  {stats.likeCount}
                  <span
                    style={{
                      paddingRight: '10px'
                    }}
                  />
                  <ThumbDownIcon
                    sx={{
                      paddingRight: '10px'
                    }}
                  />
                  {stats.dislikeCount}
                </Grid>
              </Grid>
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
              <div style={{ cursor: 'pointer' }}>
                <VideoBlock
                  key={item.id}
                  id={item.id}
                  videoThumbnail={item.thumbnail}
                  profileThumbnail={item.thumbnail}
                  title={item.title}
                  author={item.author}
                  date={item.date}
                  huiMeta={item.huiMeta} // this is probably too much props drilling
                  stats={item.youtubeStatistics} // this is probably too much props drilling
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
