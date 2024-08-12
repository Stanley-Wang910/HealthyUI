from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import shlex
import json
import os
import go_interface
import utils
from yt_transcript import get_relevant_transcript
import keyword_ex


trk = keyword_ex.TextRankKeyword()


app = Flask(__name__)

CORS(app, supports_credentials=True, origins=['http://localhost:3000'])

# @app.route('/api/test', methods=['GET']) 

@app.route('/test')
def test():
    return jsonify({'message': 'Hello World!'})

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




    


