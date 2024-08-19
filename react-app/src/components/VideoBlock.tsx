import { VideoType } from '../api/dto'
import { Grid } from '@mui/material'
import CommentIcon from '@mui/icons-material/Comment'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import React from 'react'

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
  stats: VideoType['statistics']
  huiMeta: VideoType['huiMeta']
  onClick: (id: string, huiMeta: VideoType['huiMeta']) => void
}) => {
  return (
    <div
      className="preview"
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(id, huiMeta)}
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

export default VideoBlock
