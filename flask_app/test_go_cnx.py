import ctypes
import os

library = ctypes.cdll.LoadLibrary('./library.dll')
fact_check_get_cc = library.FactCheckGETConcurrent

fact_check_get_cc.argtypes = [ctypes.POINTER(ctypes.c_char_p), ctypes.c_int, ctypes.c_char_p]
fact_check_get_cc.restype = ctypes.c_char_p
library.FreeResult.argtypes = [ctypes.c_char_p]

queries = [b'JD Vance Couch', b'Global Warming']
query_array = (ctypes.c_char_p * len(queries))(*queries) # Explain this

google_api_key = os.getenv('GOOGLE_API_KEY')
if not google_api_key:
    raise ValueError('GOOGLE_API_KEY not set in .env')

api_key_bytes = google_api_key.encode('utf-8')

result = fact_check_get_cc(query_array, len(queries), api_key_bytes)

if result:
    print(result.decode('utf-8'))
    library.FreeResult(result)
    print('Success')

else:
    print('Error')




fact_check_get_cc()

# os get env