from flask import request
import json
from conftest import client
import pytest

@pytest.fixture(params=[
    'qwbIu2PzCRs',
    'qwbIu2PzCRs,Vxq6Qc-uAmE',
    '',
    'invalid_id'
])
def ids(request):
    return request.param

@pytest.fixture(params=[
    'jd vance couch',
    'jd vance couch,global warming,olympics',
    '',
])
def queries(request):
    return request.param

@pytest.mark.parametrize('endpoint', [
    '/yt/video',
    '/yt/tr-mr',
    '/yt/rtr',
    '/yt/tr-kw',
    '/yt/b-kw',
    '/yt/news',
    '/yt/fc',
    '/yt/fc-news'
])
def test_youtube_endpoints(client, ids, endpoint):   # test single video id
    query_string = {'ids': ids}
    response = client.get(endpoint, query_string=query_string)

    if not ids:
        assert response.status_code == 400
        assert response.json == {'error': 'Missing ids parameter'}
    else:
        assert response.status_code == 200


@pytest.mark.parametrize('endpoint', [
    '/fc',
    '/news',    
])
def test_query_endpoints(client, queries, endpoint):   
    query_string = {'queries': queries}

    response = client.get(endpoint, query_string=query_string)

    if not queries:
        assert response.status_code == 400
        assert response.json == {'error': 'Missing queries parameter'}
    else:
        assert response.status_code == 200