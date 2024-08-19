import React, { createContext, useState, ReactNode, useContext } from 'react'

// Define the type for the context state
type VideoOpenContextType = {
  value: boolean
  updateValue: (newValue: boolean) => void
}

// Provide initial values directly in createContext
const defaultValues: VideoOpenContextType = {
  value: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateValue: () => {} // why react.dispatch undefined
}

// Create the context with an initial undefined type, later to be asserted
const VideoOpenContext = createContext<VideoOpenContextType>(defaultValues)

// Define the props type for the provider
type ProviderProps = {
  children: ReactNode
}

export const VideoOpenProvider = ({ children }: ProviderProps) => {
  const [value, setValue] = useState<boolean>(false)

  const updateValue = (newValue: boolean) => {
    setValue(newValue)
  }

  return (
    <VideoOpenContext.Provider value={{ value, updateValue }}>
      {children}
    </VideoOpenContext.Provider>
  )
}

// Custom hook to use the context
export const useMyContext = () => {
  const context = useContext(VideoOpenContext)
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider')
  }
  return context
}

export default VideoOpenContext
