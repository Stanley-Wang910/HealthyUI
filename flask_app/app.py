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
        video_ids = ['TP9fPxs2fcw'] 
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

# TEST: Get keywords and keyphrases, query strings from youtube metadata + relevant transcripts
@app.route('/test/yt4')
def test_keywords_from_youtube_metadata():
    video_ids = ['p572p-irRaU', 'https://www.youtube.com/watch?v=VHZDxOmRthE', '63EVXf_S4WQ'] 

    transcripts = yt_transcript.get_relevant_transcript(video_ids)

    with utils.track_memory_usage("TEST: youtube keywords + keyphrases"):
        json_results = {}
        for video_id in transcripts:
            text = transcripts[video_id]['text']
            trk.analyze(text, candidate_pos = ['NOUN', 'PROPN'], window_size=4, lower=False)
            keywords = trk.get_keywords(10)
            keyphrases = trk.yake_phrasing(text)
            dict_keyphrases = {k[0]: k[1] for k in keyphrases}
        
            # How many queries to generate, and how many keywords per query
            query_strings = trk.generate_query_strings(keywords, num_q=3, keywords_per_q=3)

            query_strings = list(query_strings)

            json_results[video_id] = {
                "query_strings": query_strings,
                "keywords": keywords,
                "keyphrases": dict_keyphrases
            }          

    return jsonify(json_results)



# TEST: Get related news articles for a list of videos
@app.route('/test/yt-news')
def test_youtube_news():
    video_ids = ['TP9fPxs2fcw']

    transcripts = yt_transcript.get_relevant_transcript(video_ids)

    id_query_map = {}
    for video_id in transcripts:
        text = transcripts[video_id]['text']
        trk.analyze(text, candidate_pos = ['NOUN', 'PROPN'], window_size=4, lower=False)
        keywords = trk.get_keywords(10)
        keyphrases = trk.yake_phrasing(text)
        dict_keyphrases = {k[0]: k[1] for k in keyphrases}
    
        # How many queries to generate, and how many keywords per query
        queries = trk.generate_query_strings(keywords, num_q=3, keywords_per_q=3)
        
        queries = list(queries)

        
        id_query_map[video_id] = {
                "query_strings": queries,
                "keywords": keywords,
                "keyphrases": dict_keyphrases
            }

    json_results = {}
    for video_id in id_query_map:
        queries = id_query_map[video_id]["query_strings"]

        queries = utils.strings_to_bytes(queries) 
        headlines = go_interface.news_api_cc(queries)
        queries =  utils.bytes_to_strings(queries)
        

        json_results[video_id] = {
            "query_strings": queries,
            "headlines": headlines
        }

    return jsonify(json_results)

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




    


