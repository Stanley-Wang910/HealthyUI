import React from "react";
import "../styles/MainFeed.css";

import thumbnail1 from "../thumbnails/thumbnail-1.webp";
import thumbnail2 from "../thumbnails/thumbnail-2.webp";
import thumbnail3 from "../thumbnails/thumbnail-3.webp";
import thumbnail4 from "../thumbnails/thumbnail-4.webp";
import thumbnail5 from "../thumbnails/thumbnail-5.webp";
import thumbnail6 from "../thumbnails/thumbnail-6.webp";

import channel1 from "../channel-pics/channel-1.jpeg";
import channel2 from "../channel-pics/channel-2.jpeg";
import channel3 from "../channel-pics/channel-3.jpeg";
import channel4 from "../channel-pics/channel-4.jpeg";
import channel5 from "../channel-pics/channel-5.jpeg";
import channel6 from "../channel-pics/channel-6.jpeg";

const MainFeed = () => {
  return (
    <div class="video-grid">
      <div class="preview">
        <div class="thumbnail-row">
          <img class="thumbnail" src={thumbnail1} />
        </div>

        <div class="video-info-grid">
          <div class="channel-pic">
            <img class="profile-pic" src={channel1} />
          </div>

          <div class="video-info">
            <p class="title">
              Talking Tech and AI with Google CEO Sundar Pichai!
            </p>

            <p class="author">Marques Brownlee</p>

            <p class="stats">3.4M views &middot; 6 months ago</p>
          </div>
        </div>
      </div>

      <div class="preview">
        <div class="thumbnail-row">
          <img class="thumbnail" src={thumbnail2} />
        </div>

        <div class="video-info-grid">
          <div class="channel-pic">
            <img class="profile-pic" src={channel2} />
          </div>

          <div class="video-info">
            <p class="title">Try Not To Laugh Challenge #9</p>

            <p class="author">Markiplier</p>

            <p class="stats">19M views &middot; 4 years ago</p>
          </div>
        </div>
      </div>

      <div class="preview">
        <div class="thumbnail-row">
          <img class="thumbnail" src={thumbnail3} />
        </div>

        <div class="video-info-grid">
          <div class="channel-pic">
            <img class="profile-pic" src={channel3} />
          </div>

          <div class="video-info">
            <p class="title">Crazy Tik Toks Taken Moments Before DISASTER</p>

            <p class="author">SSSniperWolf</p>

            <p class="stats">12M views &middot; 1 year ago</p>
          </div>
        </div>
      </div>

      <div class="preview">
        <div class="thumbnail-row">
          <img class="thumbnail" src={thumbnail4} />
        </div>

        <div class="video-info-grid">
          <div class="channel-pic">
            <img class="profile-pic" src={channel4} />
          </div>

          <div class="video-info">
            <p class="title">
              The Simplest Math Problem No One Can Solve - Collatz Conjecture
            </p>

            <p class="author">Veritasium</p>

            <p class="stats">18M views &middot; 4 months ago</p>
          </div>
        </div>
      </div>
      <div class="preview">
        <div class="thumbnail-row">
          <img class="thumbnail" src={thumbnail5} />
        </div>

        <div class="video-info-grid">
          <div class="channel-pic">
            <img class="profile-pic" src={channel5} />
          </div>

          <div class="video-info">
            <p class="title">
              Kadane's Algorithm to Maximum Sum Subarray Problem
            </p>

            <p class="author">CS Dojo</p>

            <p class="stats">519K views &middot; 5 years ago</p>
          </div>
        </div>
      </div>

      <div class="preview">
        <div class="thumbnail-row">
          <img class="thumbnail" src={thumbnail6} />
        </div>

        <div class="video-info-grid">
          <div class="channel-pic">
            <img class="profile-pic" src={channel6} />
          </div>

          <div class="video-info">
            <p class="title">Anything You Can Fit In The Circle I'll Pay For</p>

            <p class="author">MrBeast</p>

            <p class="stats">141M views &middot; 1 year ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeed;
