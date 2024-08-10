import React from 'react'
import '../styles/MainFeed.css'

import { useQuery } from 'react-query'
import { fetchUserVideos } from '../api/api-calls'
import { VideoType } from '../api/dto'

const MainFeed = () => {
  const { data, error, isError, isLoading } = useQuery(
    'fetchUserVideos',
    fetchUserVideos
  )

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

  console.log('data')
  console.log(data)

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
          console.log('its true i am clicked ', id)
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

            <p className="stats">{viewCount} &middot; 6 months ago</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="video-grid px-4">
        {data.map((item: VideoType, index: number) => {
          return (
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
          )
        })}

        {/*   <div className="preview">
        <div className="thumbnail-row">
          <img className="thumbnail" src={thumbnail2} alt="thumbnail"/>
        </div>
        
        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel2} alt="channel"/>
          </div>
          
          <div className="video-info">
            <p className="title">Try Not To Laugh Challenge #9</p>
            
            <p className="author">Markiplier</p>
            
            <p className="stats">19M views &middot; 4 years ago</p>
          </div>
        </div>
      </div>
      
      <div className="preview">
        <div className="thumbnail-row">
          <img className="thumbnail" src={thumbnail3} alt="thumbnail"/>
        </div>
        
        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel3} alt="channel"/>
          </div>
          
          <div className="video-info">
            <p className="title">
              Crazy Tik Toks Taken Moments Before DISASTER
            </p>
            
            <p className="author">SSSniperWolf</p>
            
            <p className="stats">12M views &middot; 1 year ago</p>
          </div>
        </div>
      </div>
      
      <div className="preview">
        <div className="thumbnail-row">
          <img className="thumbnail" src={thumbnail4} alt="thumbnail"/>
        </div>
        
        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel4} alt="channel"/>
          </div>
          
          <div className="video-info">
            <p className="title">
              The Simplest Math Problem No One Can Solve - Collatz Conjecture
            </p>
            
            <p className="author">Veritasium</p>
            
            <p className="stats">18M views &middot; 4 months ago</p>
          </div>
        </div>
      </div>
      <div className="preview">
        <div className="thumbnail-row">
          <img className="thumbnail" src={thumbnail5} alt="thumbnail"/>
        </div>
        
        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel5} alt="channel"/>
          </div>
          
          <div className="video-info">
            <p className="title">
              Kadane's Algorithm to Maximum Sum Subarray Problem
            </p>
            
            <p className="author">CS Dojo</p>
            
            <p className="stats">519K views &middot; 5 years ago</p>
          </div>
        </div>
      </div>
      
      <div className="preview">
        <div className="thumbnail-row">
          <img className="thumbnail" src={thumbnail6} alt="thumbnail"/>
        </div>
        
        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel6} alt="channel"/>
          </div>
          
          <div className="video-info">
            <p className="title">
              Anything You Can Fit In The Circle I'll Pay For
            </p>
            
            <p className="author">MrBeast</p>
            
            <p className="stats">141M views &middot; 1 year ago</p>
          </div>
        </div>
      </div>*/}
      </div>
    </>
  )
}

export default MainFeed
