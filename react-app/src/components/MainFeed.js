import React from 'react'
import '../styles/MainFeed.css'

import thumbnail1 from '../thumbnails/thumbnail-1.webp'
import thumbnail2 from '../thumbnails/thumbnail-2.webp'
import thumbnail3 from '../thumbnails/thumbnail-3.webp'
import thumbnail4 from '../thumbnails/thumbnail-4.webp'
import thumbnail5 from '../thumbnails/thumbnail-5.webp'
import thumbnail6 from '../thumbnails/thumbnail-6.webp'

import channel1 from '../channel-pics/channel-1.jpeg'
import channel2 from '../channel-pics/channel-2.jpeg'
import channel3 from '../channel-pics/channel-3.jpeg'
import channel4 from '../channel-pics/channel-4.jpeg'
import channel5 from '../channel-pics/channel-5.jpeg'
import channel6 from '../channel-pics/channel-6.jpeg'

const MainFeed = () => {
  return (
    <div className="video-grid px-4">
      <div className="preview">
        <div className="thumbnail-row">
          <img className="thumbnail" src={thumbnail1} alt="thumbnail" />
        </div>

        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel1} alt="channel" />
          </div>

          <div className="video-info">
            <p className="title">
              Talking Tech and AI with Google CEO Sundar Pichai!
            </p>

            <p className="author">Marques Brownlee</p>

            <p className="stats">3.4M views &middot; 6 months ago</p>
          </div>
        </div>
      </div>

      <div className="preview">
        <div className="thumbnail-row">
          <img className="thumbnail" src={thumbnail2} alt="thumbnail" />
        </div>

        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel2} alt="channel" />
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
          <img className="thumbnail" src={thumbnail3} alt="thumbnail" />
        </div>

        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel3} alt="channel" />
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
          <img className="thumbnail" src={thumbnail4} alt="thumbnail" />
        </div>

        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel4} alt="channel" />
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
          <img className="thumbnail" src={thumbnail5} alt="thumbnail" />
        </div>

        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel5} alt="channel" />
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
          <img className="thumbnail" src={thumbnail6} alt="thumbnail" />
        </div>

        <div className="video-info-grid">
          <div className="channel-pic">
            <img className="profile-pic" src={channel6} alt="channel" />
          </div>

          <div className="video-info">
            <p className="title">
              Anything You Can Fit In The Circle I'll Pay For
            </p>

            <p className="author">MrBeast</p>

            <p className="stats">141M views &middot; 1 year ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeed
