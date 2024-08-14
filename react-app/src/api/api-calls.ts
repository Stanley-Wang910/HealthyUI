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

export const fetchUserVideos = async (videoIds: string | string[] = []) => {
  const ids = Array.isArray(videoIds) ? videoIds : [videoIds];
  const encodedIds = encodeURIComponent(ids.join(','));
  const url = `${apiHost}/yt/video?ids=${encodedIds}`
  console.log(url)
  const { data } = await axios.get(
    `${apiHost}/yt/video?ids=${encodedIds}`
  );
  console.log(data)
  return data;
};

export const fetchNewsFactCheck = async (videoMeta: any) => {
  const { data } = await axios.post(`${apiHost}/yt/fc`, videoMeta);
  return data;
};