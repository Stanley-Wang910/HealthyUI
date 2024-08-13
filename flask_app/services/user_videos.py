from pprint import pprint
from typing import TypedDict
from faker import Factory

fake = Factory.create()

from dummy_data import video_list
from go_interface import youtube_cc

youtube_ids = [b'ARPzNBahjEg', b'aAbjtW7ZtmU', b'_ZTZGz1xusA', b'Nkq_mI2PlM8', b'Cl3izXcp86w', b'0w3NtkYRtDM']


class VideoMeta(TypedDict):
    spectrum_calc: float
    placeholder: str
    title: str
    description: str


class VideoInfo(TypedDict):
    id: str
    title: str
    thumbnail: str
    channel_thumbnail: str
    author: str
    views: str
    date: str
    meta: VideoMeta


def simplify_youtube_data(data):
    simplified_videos = []

    for video_details in data.values():
        for item in video_details['APIRes']['items']:
            video_data = {
                'id': item['id'],
                'title': item['snippet']['title'],
                'thumbnail': item['snippet']['thumbnails']['high']['url'],
                'channel_thumbnail': '',  # Placeholder, as this information isn't available directly
                'author': item['snippet']['channelTitle'],
                'views': item['statistics']['viewCount'],
                'date': item['snippet']['publishedAt'],
                'meta': {
                    'title': fake.text(max_nb_chars=20),
                    'spectrum_calc':  fake.random_int(min=0, max=10) / 10,
                    'placeholder': fake.text(max_nb_chars=100),
                    'description': fake.text(max_nb_chars=250)
                }
            }
            simplified_videos.append(video_data)

    return simplified_videos


def get_user_videos_playlist_service(keyword: str):
    if keyword is not None:
        # get search by keyword service
        return video_list.get_video_list_by_keyword(keyword)

    # get default user list
    res = youtube_cc(youtube_ids)
    formatted_data = simplify_youtube_data(res)
    return formatted_data
