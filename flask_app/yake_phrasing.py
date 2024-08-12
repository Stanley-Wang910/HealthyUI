from yt_transcript import get_relevant_transcript
import yake


### Not that good

video_id = "https://www.youtube.com/watch?v=alp_Sx5qhn0"
text = get_relevant_transcript(video_id, 10)

# Mix between Yake and TextRank may be best

kw_extractor = yake.KeywordExtractor()
keywords = kw_extractor.extract_keywords(text)

for kw in keywords:
    print(kw)