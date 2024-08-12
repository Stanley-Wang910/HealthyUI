from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import json
import os
import go_interface
import utils
from yt_transcript import get_relevant_transcript
import keyword_ex
from services import user_videos



trk = keyword_ex.TextRankKeyword()


app = Flask(__name__)

# CORS(app, supports_credentials=True, origins=['*'])
# the supports credentials option is bugging sometimes
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/api/test')
def test():
    return jsonify({'message': 'Hello World!'})


@app.route('/api/video/get-playlist/<keyword>')
@app.route('/api/video/get-playlist/', defaults={'keyword': None})
def get_user_videos_playlist(keyword: str):

    if keyword:
        print(f"Keyword provided: {keyword}")
    else:
        print("No keyword provided")
    return jsonify(user_videos.get_user_videos_playlist_service(keyword))


@app.route('/api')
def run_factcheck_go():
    try:
        # fc_queries = [b'JD Vance Couch', b'Global Warming', b'Olympics', b'Ukraine', b'COVID-19', b'Russia', b'Trump', b'Donald Trump']
        # news_queries = [b'Global Warming', b'COVID-19', b'Olympics']
        youtube_ids = ['Tw9LWetS49k', '_ZTZGz1xusA', 'Nkq_mI2PlM8', 'Cl3izXcp86w'] 
       
        transcripts = get_relevant_transcript(youtube_ids)

        query_map = {}
        for video_id in transcripts:
            text = transcripts[video_id]['text']
            trk.analyze(text, candidate_pos = ['NOUN', 'PROPN'], window_size=4, lower=False)
            print(f"Keywords for {video_id}:")
            keywords = trk.get_keywords(10)

            query_strings = trk.generate_query_strings(keywords, num_q=3, keywords_per_q=5)
            print("query_strings for video_id:", video_id)
            for q in query_strings:
                print("Query string:", repr(q)) # print query string in true form
            query_string = ",".join(str(q) for q in query_strings)
            query_map[video_id] = query_string

        
        return jsonify(query_map)
            # return jsonify(result.stdout)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5000)




    


