from faker import Factory
import random

fake = Factory.create()


def get_video_list_by_keyword(keyword: str):
    new_video_list = get_video_list()
    random.shuffle(new_video_list)
    # this is just to show that a different result set is being retured
    return new_video_list


def get_video_list():
    return [
        {
            'id': 'ARPzNBahjEg',
            'title': 'Talking Tech and AI with Google CEO Sundar Pichai!',
            'thumbnail': '/assets/images/thumbnails/thumbnail-6.webp',
            'channel-thumbnail': '/assets/images/channel-pics/channel-1.jpeg',
            'author': 'Marques Brownlee',
            'views': '3.4M views',
            'date': '6 months ago',
            'meta': {
                'title': fake.text(max_nb_chars=20),
                'spectrum_calc': 0.1,
                'placeholder': fake.text(max_nb_chars=100),
                'description': fake.text(max_nb_chars=250)

            }
        },
        {
            'id': 'aAbjtW7ZtmU',
            'title': 'Try Not To Laugh Challenge #9',
            'thumbnail': '/assets/images/thumbnails/thumbnail-1.webp',
            'channel-thumbnail': '/assets/images/channel-pics/channel-6.jpeg',
            'author': 'Marques Brownlee',
            'views': '3.4M views',
            'date': '6 months ago',
            'meta': {
                'title': fake.text(max_nb_chars=20),
                'spectrum_calc': 0.7,
                'placeholder': fake.text(max_nb_chars=100),
                'description': fake.text(max_nb_chars=250)

            }
        },
        {
            'id': 'F05wh5lQr68',
            'title': 'Crazy Tik Toks Taken Moments Before DISASTER',
            'thumbnail': '/assets/images/thumbnails/thumbnail-2.webp',
            'channel-thumbnail': '/assets/images/channel-pics/channel-5.jpeg',
            'author': 'Marques Brownlee',
            'views': '3.4M views',
            'date': '6 months ago',
            'meta': {
                'title': fake.text(max_nb_chars=20),
                'spectrum_calc': 0.7,
                'placeholder': fake.text(max_nb_chars=100),
                'description': fake.text(max_nb_chars=250)

            }
        },
        {
            'id': 'Fuj4vNFREzg',
            'title': 'Talking Tech and AI with Google CEO Sundar Pichai!',
            'thumbnail': '/assets/images/thumbnails/thumbnail-3.webp',
            'channel-thumbnail': '/assets/images/channel-pics/channel-4.jpeg',
            'author': 'Marques Brownlee',
            'views': '3.4M views',
            'date': '6 months ago',
            'meta': {
                'title': fake.text(max_nb_chars=20),
                'spectrum_calc': 0.7,
                'placeholder': fake.text(max_nb_chars=100),
                'description': fake.text(max_nb_chars=250)

            }
        },
        {
            'id': 'HjPEr3kw1Yw',
            'title': 'Talking Tech and AI with Google CEO Sundar Pichai!',
            'thumbnail': '/assets/images/thumbnails/thumbnail-4.webp',
            'channel-thumbnail': '/assets/images/channel-pics/channel-3.jpeg',
            'author': 'Marques Brownlee',
            'views': '3.4M views',
            'date': '6 months ago',
            'meta': {
                'title': fake.text(max_nb_chars=20),
                'spectrum_calc': 0.2,
                'placeholder': fake.text(max_nb_chars=100),
                'description': fake.text(max_nb_chars=250)

            }
        },
        {
            'id': '0w3NtkYRtDM',
            'title': 'Talking Tech and AI with Google CEO Sundar Pichai!',
            'thumbnail': '/assets/images/thumbnails/thumbnail-5.webp',
            'channel-thumbnail': '/assets/images/channel-pics/channel-2.jpeg',
            'author': 'Marques Brownlee',
            'views': '3.4M views',
            'date': '6 months ago',
            'meta': {
                'title': fake.text(max_nb_chars=20),
                'spectrum_calc': 0.6,
                'placeholder': fake.text(max_nb_chars=100),
                'description': fake.text(max_nb_chars=250)

            }
        }]
