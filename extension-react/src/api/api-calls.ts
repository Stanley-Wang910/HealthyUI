// @ts-nocheck
import axios from 'axios'
import results from '../assets/results'

/*******************************************************
 * Define All API Calls Here
 * then wrap them for use in your FR with react query
 *******************************************************/
// @todo move this to env file
// const apiHost = process.env.REACT_APP_BACKEND_HOST ?? 'http://127.0.0.1:5000'
const apiHost = 'http://127.0.0.1:8080'

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

const cachedResult = (id) => {
  const tempRes = results[id]
  return [{ ...tempRes }]
}

export const fetchNewsFactCheck = async (videoIds: string | string[] = []) => {
  const ids = Array.isArray(videoIds) ? videoIds : [videoIds]
  const firstId = ids[0]
  const encodedIds = encodeURIComponent(ids.join(','))
  const url = `${apiHost}/yt/fc?ids=${encodedIds}`

  try {
    const { data } = await axios.get(url)

    // Check if data is empty and fallback to static data
    if (Object.keys(data).length === 0 || data.error) {
      console.log('Fallback to static data')
      // Access static data based on firstId
      return cachedResult(firstId)
    }

    return data
  } catch (error) {
    console.log('Error fetching data, using static data')
    // Handle error by returning static data based on firstId
    return cachedResult(firstId)
  }
}
