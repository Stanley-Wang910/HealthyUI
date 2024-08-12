import axios from 'axios'

/*******************************************************
 * Define All API Calls Here
 * then wrap them for use in your FR with react query
 *******************************************************/
const apiHost = 'http://127.0.0.1:5000'

export const fetchTestData = async () => {
  const { data } = await axios.get(`${apiHost}/api/test`)
  return data
}

export const fetchUserVideos = async (keyword?: string) => {
  const encoded = keyword ? encodeURI(keyword) : ''
  const { data } = await axios.get(
    `${apiHost}/api/video/get-playlist/${encoded}`
  )
  return data
}
