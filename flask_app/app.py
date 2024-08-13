from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import json
import os
import go_interface
import utils
import yt_transcript  
import keyword_ex
from services import user_videos



trk = keyword_ex.TextRankKeyword()

app = Flask(__name__)

# CORS(app, supports_credentials=True, origins=['*'])
# the supports credentials option is bugging sometimes
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/api/video/get-playlist/<keyword>')
@app.route('/api/video/get-playlist/', defaults={'keyword': None})
def get_user_videos_playlist(keyword: str):

    if keyword:
        print(f"Keyword provided: {keyword}")
    else:
        print("No keyword provided")
    return jsonify(user_videos.get_user_videos_playlist_service(keyword))

@app.route('/yt/transcript', methods=['GET'])
def get_yt_transcript():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Missing video_id parameter'}), 400
    transcript, source = yt_transcript.get_transcript(video_id)
    return jsonify({'transcript': transcript, 'source': source})

@app.route('/yt/relevant-transcript', methods=['GET'])
def get_yt_keywords():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Missing video_id parameter'}), 400
    
    transcript = yt_transcript.get_relevant_transcript([video_id], tolerance_sec=20, option="asc")
    return jsonify(transcript)

# TEST: Get video metadata for a list of videos
@app.route('/test/yt1')
def test_youtube_cc():
    with utils.track_memory_usage("TEST: grab youtube metadata"):
        video_ids = ['Tw9LWetS49k', '_ZTZGz1xusA', 'Nkq_mI2PlM8', 'Cl3izXcp86w'] 
        video_ids = yt_transcript.extract_ids(video_ids)
        res = go_interface.youtube_cc(video_ids)
        return jsonify(res)

# TEST: Get transcripts and most replayed timestamps concurrently for a list of videos
@app.route('/test/yt2')
def test_youtube_transcript_most_replayed_cc():
    with utils.track_memory_usage("TEST: grab youtube transcripts and most replayed timestamps"):
        video_ids = ['_aSZ4AfSVWQ'] 
        video_ids = yt_transcript.extract_ids(video_ids)
        res = go_interface.youtube_transcript_most_replayed_cc(video_ids)
        return jsonify(res)

# TEST: Get relevant transcripts for a list of videos concurrently
@app.route('/test/yt3')
def test_relevant_transcripts_cc():
    with utils.track_memory_usage("TEST: grab youtube videos relevant transcripts"):
        video_ids = ['_aSZ4AfSVWQ', 'VTB0_SBltDw', '9Q0pU8urstM']
        video_ids = yt_transcript.extract_ids(video_ids)
        res = go_interface.youtube_relevant_transcript_cc(video_ids)
        return jsonify(res)

# TEST: Get relevant keywords from youtube metadata + relevant transcripts
@app.route('/test/yt4')
def test_keywords_from_youtube_metadata():
    video_ids = ['p572p-irRaU'] 

    transcripts = yt_transcript.get_relevant_transcript(video_ids)

    json_results = {}
    for video_id in transcripts:
        text = transcripts[video_id]['text']
        print(text)
        trk.analyze(text, candidate_pos = ['NOUN', 'PROPN'], window_size=4, lower=False)
        print(f"Keywords for {video_id}:")
        keywords = trk.get_keywords(10)
        keyphrases = trk.yake_phrasing(text)
        dict_keyphrases = {k[0]: k[1] for k in keyphrases}
      
        # How many queries to generate, and how many keywords per query
        query_strings = trk.generate_query_strings(keywords, num_q=3, keywords_per_q=5)
        print("query_strings for video_id:", video_id)
        for q in query_strings:
            print("Query string:", repr(q)) # print query string in true form
        query_string = ",".join(str(q) for q in query_strings)

        json_results[video_id] = {
            "query_strings": query_string,
            "keywords": keywords,
            "keyphrases": dict_keyphrases
        }          

    return jsonify(json_results)

# TEST: Get keywords and query strings



# TEST: Get fact checked results for a list of queries
@app.route('/test/fc')
def test_fact_check_cc():
    with utils.track_memory_usage("TEST: fact check"):
        queries = ['JD Vance Couch', 'Global Warming', 'Olympics', 'Ukraine', 'COVID-19', 'Russia', 'Trump', 'Donald Trump']
        queries = utils.strings_to_bytes(queries)
        res = go_interface.fact_check_cc(queries)
        return jsonify(res)

# TEST: Get news headlines for a list of queries
@app.route('/test/news')
def test_news_api_cc():
    with utils.track_memory_usage("TEST: news API"):
        queries = ['Global Warming', 'COVID-19', 'Olympics']
        queries = utils.strings_to_bytes(queries)
        res = go_interface.news_api_cc(queries)
        return jsonify(res)






if __name__ == '__main__':
    app.run(debug=True, port=5000)




    


