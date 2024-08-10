from rake_nltk import Rake
from yt_transcript import get_relevant_transcript

r = Rake()

video_id = "https://www.youtube.com/watch?v=ycJGIKLE9hg"
text = get_relevant_transcript(video_id, 10)

# 

# Extraction given the text.
r.extract_keywords_from_text(text)
ranked_keywords = r.get_ranked_phrases_with_scores()
for i in range(10):
    print(ranked_keywords[i])


# print(r.extract_keywords_from_text(str(text)))

