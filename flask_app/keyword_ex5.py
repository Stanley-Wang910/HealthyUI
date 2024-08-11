from rake_nltk import Rake
from yt_transcript import get_relevant_transcript
import yake


### Not that good

video_id = "https://www.youtube.com/watch?v=M1u1ECx_Nlw"
text = get_relevant_transcript(video_id, 10)

# 
# r = Rake()

# # Extraction given the text.
# r.extract_keywords_from_text(text)
# ranked_keywords = r.get_ranked_phrases_with_scores()
# for i in range(10):
#     print(ranked_keywords[i])


# print(r.extract_keywords_from_text(str(text)))

# Mix between rake and TextRank may be best

kw_extractor = yake.KeywordExtractor()
keywords = kw_extractor.extract_keywords(text)

for kw in keywords:
    print(kw)