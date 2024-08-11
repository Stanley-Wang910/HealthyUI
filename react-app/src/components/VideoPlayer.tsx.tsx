import {Box, Modal} from "@mui/material"
import {YouTubeEvent} from "react-youtube"

const YoutubePlayerWrapper = () => {
  const onReady = (evt: YouTubeEvent) => {
    console.log('onReady')
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
    console.log('onReady')
  }
  const onPlaybackRateChange = (evt: YouTubeEvent) => {
    console.log('onReady')
  }
  const onPlaybackQualityChange = (evt: YouTubeEvent) => {
    console.log('onReady')
  }
  return <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
  >
    <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          p: 3
        }}
    >
      <YouTube
          videoId={videoId}
          id={videoId}
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
    </Box>
  </Modal>
</>
}