from pprint import pprint
from typing import TypedDict
from faker import Factory

import yt_transcript

fake = Factory.create()

from dummy_data import video_list
from go_interface import youtube_cc

youtube_ids = [
    b'74kHGCBHvDc',
    b'8RVooYlyl20',
    b'Cx3tIR7C-pM',
    b'ImSlcxvDz4Q',
    b'M1u1ECx_Nlw',
    b'UE6QxBaIEv8',
    b'bNH16A4f5Yk',
    b'kZ-kK6mJRKM',
    b'X2tzjK_-mko',
    b'k357uIJzcr0',
]


# @todo these are out of date now as we made resp closer to youtube API
class VideoMeta(TypedDict):
    spectrum_calc: float
    placeholder: str
    title: str
    description: str


# @todo these are out of date now as we made resp closer to youtube API
class VideoInfo(TypedDict):
    id: str
    title: str
    thumbnail: str
    channel_thumbnail: str
    author: str
    views: str
    date: str
    meta: VideoMeta


#########################################################
#
#########################################################
def simplify_youtube_data(data):
    simplified_videos = []

    for video_id in data.values():
        for item in video_id['items']:
            video_data = {
                'id': item['id'],
                'statistics': item['statistics'],
                'snippet': item['snippet'],
                'topicDetails': item['topicDetails'],
                # keep this for now, they are just for demo purposes
                # but most likely tehy will be resplaces by independent API
                # calls and data types
                # it's just to illustrate that our data type
                # doesn't necessarily match the one coming back from youtube
                'huiMeta': {
                    'title': fake.text(max_nb_chars=20),
                    'spectrum_calc': fake.random_int(min=0, max=10) / 10,
                    'placeholder': fake.text(max_nb_chars=100),
                    'description': fake.text(max_nb_chars=250)
                }
            }
            simplified_videos.append(video_data)

    return simplified_videos


# if no ids defined
def get_default_video_list():
    temp_ids = youtube_ids
    res = youtube_cc(temp_ids)
    formatted_data = simplify_youtube_data(res)
    return formatted_data


# placeholder / stubb
def get_video_by_keyword_search(keyword: str):
    temp_ids = youtube_ids
    res = youtube_cc(temp_ids)
    formatted_data = simplify_youtube_data(res)
    return formatted_data


def get_video_by_ids(video_ids: str):
    extracted_video_ids = yt_transcript.extract_ids(video_ids)
    res = youtube_cc(extracted_video_ids)
    formatted_data = simplify_youtube_data(res)
    return formatted_data
