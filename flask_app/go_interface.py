import ctypes
import os
import json
import utils
from dotenv import load_dotenv

load_dotenv()

# Load library
with utils.track_memory_usage("Loading library"):
    library = ctypes.cdll.LoadLibrary('./library.dll')

    fact_check_get_cc = library.FactCheckGETConcurrent
    news_api_get_cc = library.NewsApiGETConcurrent
    youtube_get_cc = library.YoutubeGETConcurrent

    free_result = library.FreeResult
    get_alloc_count = library.GetAllocCount 

# Initialize argtypes and restypes for C memory functions
free_result.argtypes = [ctypes.c_char_p]
free_result.restype = ctypes.c_bool
get_alloc_count.restype = ctypes.c_int

# Initialize argtypes and restypes for fact_check_get_cc
fact_check_get_cc.argtypes = [ctypes.POINTER(ctypes.c_char_p), ctypes.c_int, ctypes.c_char_p]
fact_check_get_cc.restype = ctypes.POINTER(ctypes.c_char)

# Initialize argtypes and restypes for news_api_get_cc
news_api_get_cc.argtypes = [ctypes.POINTER(ctypes.c_char_p), ctypes.c_int, ctypes.c_char_p]
news_api_get_cc.restype = ctypes.POINTER(ctypes.c_char)

# Initialize argtypes and restypes for youtube_get_cc
youtube_get_cc.argtypes = [
    ctypes.POINTER(ctypes.c_char_p), 
    ctypes.c_int,
    ctypes.c_char_p,
    ctypes.c_bool
]
youtube_get_cc.restype = ctypes.POINTER(ctypes.c_char)

def fact_check_cc(queries):

    query_array = (ctypes.c_char_p * len(queries))(*queries) 

    google_api_key = os.getenv('GOOGLE_API_KEY')
    if not google_api_key:
        raise ValueError('GOOGLE_API_KEY not set in .env')

    google_api_key_bytes = google_api_key.encode('utf-8')

    try:
        result = fact_check_get_cc(query_array, len(queries), google_api_key_bytes)
        print(f"Allocated memory after fact check: {get_alloc_count()}")

        if result:
            result_str = ctypes.cast(result, ctypes.c_char_p).value.decode('utf-8')        

            try:
                free_result_success = free_result(result)
            except Exception as e:
                log_error(f"Unexpected error in free_result: {e}")
                log_error(f"Exception type: {type(e)}")


            print(f"Allocated memory after freeing: {get_alloc_count()}")
            
            return (json.dumps(json.loads(result_str), indent=2))

        else:
            print('Error: No result returned from fact check')

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        print(f"Error type: {type(e)}")

def news_api_cc(news_queries):

    news_query_array = (ctypes.c_char_p * len(news_queries))(*news_queries)
    news_api_key = os.getenv('NEWS_API_KEY')
    if not news_api_key:
        raise ValueError('NEWS_API_KEY not set in .env')
        
    news_api_key_bytes = news_api_key.encode('utf-8')

    try:
        headlines = news_api_get_cc(news_query_array, len(news_queries), news_api_key_bytes)
        print(f"Allocated memory after news API GET: {get_alloc_count()}")

        if headlines:
            headlines_str = (ctypes.cast(headlines, ctypes.c_char_p).value).decode('utf-8')

            try:
                free_result_success = free_result(headlines)

            except Exception as e:
                log_error(f"Unexpected error in free_result: {e}")
                log_error(f"Exception type: {type(e)}")

            print(f"Allocated memory after freeing: {get_alloc_count()}")
            
            return (json.dumps(json.loads(headlines_str), indent=2))
        else:
            print('Error: No result returned from news API GET')
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        print(f"Error type: {type(e)}")


def youtube_cc(ids, most_replayed=False):
    id_array = (ctypes.c_char_p * len(ids))(*ids) 
    google_api_key = os.getenv('GOOGLE_API_KEY')

    if not google_api_key:
        raise ValueError('GOOGLE_API_KEY not set in .env')
        
    google_api_key_bytes = google_api_key.encode('utf-8')

    most_replayed = ctypes.c_bool(most_replayed)

    try:
        result = youtube_get_cc(id_array, len(ids), google_api_key_bytes, most_replayed)
        print(f"Allocated memory after youtube: {get_alloc_count()}")
        
        if result:
            result_str = ctypes.cast(result, ctypes.c_char_p).value.decode('utf-8')      

            try:
                free_result_success = free_result(result)
            except Exception as e:
                log_error(f"Unexpected error in free_result: {e}")
                log_error(f"Exception type: {type(e)}")

            print(f"Allocated memory after freeing: {get_alloc_count()}")
           # # return (json.dumps(json.loads(result_str), indent=2))
            return json.loads(result_str)
            return json.loads(result_str)
        else:
            print('Error: No result returned from youtube GET')
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        print(f"Error type: {type(e)}")



# fc_queries = [b'JD Vance Couch', b'Global Warming', b'Olympics', b'Ukraine', b'COVID-19', b'Russia', b'Trump', b'Donald Trump']
# news_queries = [b'Global Warming', b'COVID-19', b'Olympics']
# youtube_ids = [b'UrxkO4DM67M']







