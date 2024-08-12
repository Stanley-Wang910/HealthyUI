import React, { useState } from 'react'
import '../styles/Header.css'

import MenuIcon from '@mui/icons-material/Menu'
import search from '../icons/search.svg'
import voiceSearchIcon from '../icons/voice-search-icon.svg'
import upload from '../icons/upload.svg'
import youtubeApps from '../icons/youtube-apps.svg'
import notifications from '../icons/notifications.svg'
import MainMenu from './MainMenu'
import { useQuery } from '@tanstack/react-query'
import { fetchUserVideos } from '../api/api-calls'
import { Input } from '@mui/material'

const Header = () => {
  const [open, setOpen] = React.useState(false)
  const [input, setInput] = useState('')

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['fetchUserVideos'],
    queryFn: () => fetchUserVideos(input),
    enabled: !input
  })

  const handleSearch = async () => {
    if (input.trim() !== '') {
      await refetch()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <>
      <div className="header">
        <div className="left-section">
          <MenuIcon
            style={{ cursor: 'pointer' }}
            onClick={() => {
              toggleDrawer(true)
            }}
          />
        </div>

        <div className="middle-section">
          <Input
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
          />

          <button className="search-button">
            <img className="search-icon" src={search} alt="Search" />
          </button>

          <button className="voice-button">
            <img
              className="voice-icon"
              src={voiceSearchIcon}
              alt="Voice Search"
            />
          </button>
        </div>

        <div className="right-section">
          <img className="upload-icon" src={upload} alt="Upload" />
          <img className="apps-icon" src={youtubeApps} alt="Apps" />
          <img className="notif-icon" src={notifications} alt="Notifications" />
          <img
            className="curr-user-pic"
            src="channel-pics/my-channel.HEIC"
            alt="User"
          />
        </div>
      </div>
      <MainMenu open={open} toggleDrawer={toggleDrawer} />
    </>
  )
}

export default Header
