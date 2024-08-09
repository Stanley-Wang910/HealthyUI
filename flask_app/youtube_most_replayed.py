import http.client
import json
# from flask import jsonify


def get_most_replayed_sections():
    conn = http.client.HTTPSConnection("yt.lemnoslife.com")

    headersList = {
    "Accept": "*/*",
    }

    payload = ""

    conn.request("GET", "/videos?part=mostReplayed&id=jKC0OQC5UDw", payload, headersList)
    response = conn.getresponse()
    result = response.read()

    # print(result.decode("utf-8"))
    result_json = json.loads(result.decode("utf-8"))

    return result_json

def get_peak_rewatched_timestamps(data):
    markers = data['items'][0]['mostReplayed']['markers']
    sorted_markers = sorted(markers, key=lambda x: x['intensityScoreNormalized'], reverse=True)    
    top_markers = sorted_markers[:5]
    top_timestamps_seconds = [marker['startMillis'] / 1000 for marker in top_markers]
    top_timestamps_minutes = [marker['startMillis'] / 1000 / 60 for marker in top_markers]
    return top_timestamps_minutes

res = get_most_replayed_sections()
print(get_peak_rewatched_timestamps(res))