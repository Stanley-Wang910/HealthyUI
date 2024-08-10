import axios from "axios"

/*******************************************************
 * Define All API Calls Here
 * then wrap them for use in your FR with react query
 *******************************************************/
export const fetchTestData = async () => {
  const { data } = await axios.get("http://localhost:5000/api/test")
  return data
}
