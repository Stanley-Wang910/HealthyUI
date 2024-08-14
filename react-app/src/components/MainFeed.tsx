import React from 'react'
import '../styles/MainFeed.css'

import { fetchUserVideos } from '../api/api-calls'
import { VideoType } from '../api/dto'
import { useQuery } from '@tanstack/react-query'
import YoutubePlayerWrapper from './VideoPlayer'
import { Grid, Modal, Skeleton } from '@mui/material'
import { fetchNewsFactCheck } from '../api/api-calls'
import { useQueryClient } from '@tanstack/react-query'



const MainFeed = () => {
  const ids = ['bNH16A4f5Yk', 'OwgMv4YLU0k', 'E6bVBH9y5O8', 'M1u1ECx_Nlw', 'udiEkZSvS5E', 'AxHcShn_HvM', 'eYcpXamLmWg', 'LvXwXKjIP0A'];
  const queryClient = useQueryClient();

  const { data, error, isError, isLoading } = useQuery<VideoType>({
    queryKey: ['fetchUserVideos'],
    queryFn: () => {
      console.log('Calling fetchUserVideos with ids:', ids);
      return fetchUserVideos(ids)
    },

  });
    

  const [open, setOpen] = React.useState<boolean>(false)
  const [videoId, setVideoId] = React.useState<string>('')
  const [meta, setVideoMeta] = React.useState<VideoType[string]['items'][0] | null>(null)

  const { data: factCheckData, refetch: refetchFactCheck, isLoading: isFactCheckLoading, error: factCheckError } = useQuery({
    queryKey: ['fetchNewsFactCheck', videoId],
    queryFn: async () => {
      console.log('Fetching fact check for videoId:', videoId);
      if (!videoId || !meta) {
        console.error('VideoId or meta is not set');
        throw new Error('VideoId or meta is not set');
      }
      const result = await fetchNewsFactCheck([videoId], { [videoId]: { items: [meta] } });
      console.log('Fact check result:', result);
      return result;
    },
    enabled: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  
  });
  const handleOpen = async (id: string, videoMeta: VideoType[string]['items'][0]) => {
    console.log('handleOpen', id, videoMeta)
    setVideoId(id)
    setVideoMeta(videoMeta)
    setOpen(true)
    console.log('Invalidating and refetching fact check query');
    await queryClient.invalidateQueries({ queryKey: ['fetchNewsFactCheck', id] });
    
    try {
      const result = await refetchFactCheck();
      console.log('Refetch result:', result);
    } catch (error) {
      console.error('Error during refetch:', error);
    }
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
    viewCount,
    date,
    meta,
    onClick
  }: {
    id: string
    videoThumbnail: string
    profileThumbnail: string
    title: string
    author: string
    viewCount: string
    date: string
    meta: VideoType[string]['items'][0]
    onClick: () => void
  }) => {
    return (
      <div
        className="preview"
        style={{ cursor: 'pointer' }}

        onClick={() => {
          onClick()
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
    <Grid container spacing={3} className='px-4'> 
      {data && Object.entries(data).length > 0 ? (
        Object.entries(data).map(([videoId, videoData]) => {
          const item = videoData.items[0];
          return (
            <Grid item xs={12} sm={6} md={3} key={videoId} >
              <VideoBlock
                id={videoId}  
                videoThumbnail={item.snippet.thumbnails.medium.url}
                profileThumbnail={item.snippet.thumbnails.default.url}
                title={item.snippet.title}
                author={item.snippet.channelTitle}
                viewCount={item.statistics.viewCount}
                date={new Date(item.snippet.publishedAt).toLocaleDateString()}
                meta={item}
                onClick={() => {
                  handleOpen(videoId, item)
                }}
                />
            </Grid>
        );
      })
      ) : (
        <Grid item xs={12}>
          <p>No videos available.</p>
        </Grid>
      )}
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
        <YoutubePlayerWrapper id={videoId} meta={meta}  factCheckData={factCheckData?.[videoId]} isFactCheckLoading={isFactCheckLoading} />
      </Modal>
    </>
  )
}

export default MainFeed
