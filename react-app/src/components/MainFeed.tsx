import React, { useContext, useState } from 'react'
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
import VideoOpenContext from '../context/context'
import { fetchNewsFactCheck } from '../api/api-calls'

const MainFeed = () => {

    //
    // @stanleys work
    // const ids = ['d7cit3N5awE', 'OwgMv4YLU0k', 'E6bVBH9y5O8', 'M1u1ECx_Nlw', 'udiEkZSvS5E', 'AxHcShn_HvM', 'eYcpXamLmWg', 'LvXwXKjIP0A'];
    // const { data, error, isError, isLoading } = useQuery<VideoType>({
    //     queryKey: ['fetchUserVideos'],
    //     queryFn: () => {
    //         console.log('Calling fetchUserVideos with ids:', ids);
    //         return fetchUserVideos(ids)
    //     },
    //
    // });


  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['fetchUserVideos'],
    queryFn: () => fetchUserVideos('')
  })
  const [open, setOpen] = useState<boolean>(false)
  const [videoId, setVideoId] = useState<string>('')
  const [meta, setVideoMeta] = useState<VideoType['huiMeta']>()
  const { value, updateValue } = useContext(VideoOpenContext)

  const handleOpen = () => {
    setOpen(true)
    updateValue(true)
  }

    // const handleOpen = (id: string, videoMeta: VideoType[string]['items'][0]) => {
    //     setVideoId(id)
    //     setVideoMeta(videoMeta)
    //     setOpen(true)
    //     refetchFactCheck()
    // }

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

  const VideoBlock = ({
    id,
    videoThumbnail,
    profileThumbnail,
    title,
    author,
    date,
    stats,
    huiMeta,
    onClick
  }: {
    id: string
    videoThumbnail: string
    profileThumbnail: string
    title: string
    author: string
    date: string
    stats: VideoType['youtubeStatistics']
    huiMeta: VideoType['huiMeta']
      // meta: VideoType[string]['items'][0]
      // onClick: () => void
    onClick: () => void
  }) => {
    return (
      <div
        className="preview"
        style={{ cursor: 'pointer' }}

        onClick={() => {
          setVideoId(id)
          setVideoMeta(huiMeta)
          handleOpen()
        }}
        // onClick={() => {
        //     onClick()
        // }}
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

    // return (
    //     <>
    //         <Grid container spacing={3} className='px-4'>
    //             {data && Object.entries(data).length > 0 ? (
    //                 Object.entries(data).map(([videoId, videoData]) => {
    //                     const item = videoData.items[0];
    //                     return (
    //                         <Grid item xs={12} sm={6} md={3} key={videoId} >
    //                             <VideoBlock
    //                                 id={videoId}
    //                                 videoThumbnail={item.snippet.thumbnails.medium.url}
    //                                 profileThumbnail={item.snippet.thumbnails.default.url}
    //                                 title={item.snippet.title}
    //                                 author={item.snippet.channelTitle}
    //                                 viewCount={item.statistics.viewCount}
    //                                 date={new Date(item.snippet.publishedAt).toLocaleDateString()}
    //                                 meta={item}
    //                                 onClick={() => {
    //                                     handleOpen(videoId, item)
    //                                 }}
    //                             />
    //                         </Grid>
    //                     );
    //                 })


    if(!data.lenth) {
        <Grid container spacing={3} className='px-4'>

                <Grid item xs={12}>
                    <p>No videos available.</p>
                </Grid>
        </Grid>

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
