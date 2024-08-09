from youtube_transcript_api import YouTubeTranscriptApi

vid_id = 'WuDiiHa0U-A'
transcript_list = YouTubeTranscriptApi.list_transcripts(vid_id)

try:
    transcript_manual = transcript_list.find_manually_created_transcript(['en'])  
    if transcript_manual is not None:
        print(transcript_manual.fetch())
        print(transcript_manual.translate('en').fetch())

except Exception as e:
    print("No manual transcript found")

try:
    transcript_auto = transcript_list.find_generated_transcript(['en'])
    if transcript_auto is not None:
        # print(transcript_auto.fetch()) # with timestamps
        print(transcript_auto.translate('en').fetch()) # without timestamps

except Exception as e:
    print("No auto transcript found")
