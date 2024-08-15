import axios from 'axios'

/*******************************************************
 * Define All API Calls Here
 * then wrap them for use in your FR with react query
 *******************************************************/
// @todo move this to env file
const apiHost = process.env.REACT_APP_BACKEND_HOST ?? 'http://127.0.0.1:5000'

// use this to do a basic check if the server is up and running
// and responding to requests
export const fetchTestData = async () => {
  const { data } = await axios.get(`${apiHost}/api/test`)
  return data
}

// eventually if our results get cpu expensive
// we can also pass in a config object like
// enableFactcheck: true
// enableSpectrumCheck: true
export const fetchVideosById = async (videoIds: string | string[] = []) => {
  // default, no ids
  if (!videoIds.length) {
    const url = `${apiHost}/api/video`
    const { data } = await axios.get(url)
    return data
  }

  // handle single id or array of ids
  const ids = Array.isArray(videoIds) ? videoIds : [videoIds]
  const encodedIds = encodeURIComponent(ids.join(','))
  const url = `${apiHost}/api/video?ids=${encodedIds}`
  const { data } = await axios.get(url)
  return data
}

export const fetchNewsFactCheck = async (videoId: string) => {
  const { data } = await axios.post(`${apiHost}/yt/fc`, videoId)
  return data
}
