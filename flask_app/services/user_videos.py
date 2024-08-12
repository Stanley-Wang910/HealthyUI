from typing import TypedDict

from dummy_data import video_list


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


def get_user_videos_playlist_service(keyword: str):

    if keyword is not None:
        # get search by keyword service
        return video_list.get_video_list_by_keyword(keyword)

    # get default user list
    return video_list.get_video_list()
