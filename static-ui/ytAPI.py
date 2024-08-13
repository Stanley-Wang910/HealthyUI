import googleapiclient.discovery
import pprint 
import requests


api_service_name = "youtube"
api_version = "v3"
api_key = 'AIzaSyBUZciDaL97fUGVYG0wONN-4L4DQFIvEik'

youtube = googleapiclient.discovery.build(api_service_name, api_version, developerKey = api_key)

request = youtube.videos().list( #to call a video ID and asking for snippets, content details, and stats. 
    #part = 'snippet,contentDetails,statistics',
    part = 'statistics', #only need access to stats for likes/dislikes
    id='qqG96G8YdcE'
)


#request execution
response = request.execute()

#printing entire response
pprint.pprint(response)

#printing likes
likes = response['items'][0]['statistics']['likeCount']
pprint.pprint(f"Likes: {likes}")

#GET request of dislike API 
url = "https://returnyoutubedislikeapi.com/votes?videoId=qqG96G8YdcE"
response_dislike = requests.get(url)

if response_dislike.status_code == 200:
    data_dislike = response_dislike.json()
    pprint.pprint(data_dislike)

    dislikes = data_dislike.get('dislikes', 'N/A')
    pprint.pprint(f"Dislikes: {dislikes}")
else:
    print(f"Request failed with status code {response_dislike.status_code}")




