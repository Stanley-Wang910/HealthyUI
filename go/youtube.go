package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sync"
	"sync/atomic"
)

// #include <stdbool.h>
// #include <stdint.h>
// #include <stdio.h>
// #include <stdlib.h>
import "C"

type YoutubeAPIResponse struct {
	ID       string   `json:"id"`
	Kind     string   `json:"kind"`
	Etag     string   `json:"etag"`
	Items    []Item   `json:"items"`
	PageInfo PageInfo `json:"pageInfo"`
}

type Item struct {
	Kind         string       `json:"kind"`
	Etag         string       `json:"etag"`
	ID           string       `json:"id"`
	Snippet      Snippet      `json:"snippet"`
	Statistics   Statistics   `json:"statistics"`
	TopicDetails TopicDetails `json:"topicDetails"`
}

type Snippet struct {
	PublishedAt          string     `json:"publishedAt"`
	ChannelID            string     `json:"channelId"`
	Title                string     `json:"title"`
	Description          string     `json:"description"`
	Thumbnails           Thumbnails `json:"thumbnails"`
	ChannelTitle         string     `json:"channelTitle"`
	Tags                 []string   `json:"tags"`
	CategoryID           string     `json:"categoryId"`
	LiveBroadcastContent string     `json:"liveBroadcastContent"`
	DefaultLanguage      string     `json:"defaultLanguage"`
	Localized            Localized  `json:"localized"`
	DefaultAudioLanguage string     `json:"defaultAudioLanguage"`
}

type Localized struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type Thumbnails struct {
	Default  Default `json:"default"`
	Medium   Default `json:"medium"`
	High     Default `json:"high"`
	Standard Default `json:"standard"`
	Maxres   Default `json:"maxres"`
}

type Default struct {
	URL    string `json:"url"`
	Width  int64  `json:"width"`
	Height int64  `json:"height"`
}

type Statistics struct {
	ViewCount     string `json:"viewCount"`
	LikeCount     string `json:"likeCount"`
	FavoriteCount string `json:"favoriteCount"`
	CommentCount  string `json:"commentCount"`
}

type TopicDetails struct {
	TopicCategories []string `json:"topicCategories"`
}

type PageInfo struct {
	TotalResults   int64 `json:"totalResults"`
	ResultsPerPage int64 `json:"resultsPerPage"`
}

func youtubeGET(id string, googleApiKey string) (YoutubeAPIResponse, error) {
	// assign struct obj for GET response
	var youtubeResponse YoutubeAPIResponse

	req, err := http.NewRequest("GET", "https://www.googleapis.com/youtube/v3/videos", nil)

	if err != nil {
		return youtubeResponse, fmt.Errorf("error with GET youtube request: %v", err)
	}

	q := req.URL.Query()
	// Add query parameters here or pass them in
	q.Add("id", id)
	q.Add("key", googleApiKey)
	q.Add("part", "topicDetails,snippet,statistics")

	// {"key1": ["value1"], "key2": ["value2"]}, calling Encode will produce the string key1=value1&key2=value2
	req.URL.RawQuery = q.Encode()

	req.Header.Add("Accept", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return youtubeResponse, fmt.Errorf("failed to execute HTTP request for ID: %s: %v", id, err)
	}

	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return youtubeResponse, fmt.Errorf("failed to read response body for ID: %s: %v", id, err)
	}

	youtubeResponse.ID = req.URL.String()

	err = json.Unmarshal(body, &youtubeResponse)
	if err != nil {
		return youtubeResponse, fmt.Errorf("failed to unmarshal JSON response for ID: %s: %v", id, err)
	}

	return youtubeResponse, nil
}

//export YoutubeGETConcurrent
func YoutubeGETConcurrent(_ids **C.char, idCount C.int, _googleApiKey *C.char) *C.char {
	ids := CStrArrayToSlice(_ids, idCount)

	googleApiKey := C.GoString(_googleApiKey)
	if googleApiKey == "" {
		return C.CString("Error: GOOGLE_API_KEY is empty")
	}

	var wg sync.WaitGroup

	results := make(chan struct {
		id     string
		err    error
		result YoutubeAPIResponse
	}, len(ids))

	for _, id := range ids {
		wg.Add(1)
		go func(id string) {
			defer wg.Done()
			result, err := youtubeGET(id, googleApiKey)
			results <- struct {
				id     string
				err    error
				result YoutubeAPIResponse
			}{id, err, result}
		}(id)
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	allResults := make(map[string]YoutubeAPIResponse)

	for res := range results {
		if res.err != nil {
			fmt.Printf("error for id: %s : %v\n", res.id, res.err)
		} else {
			allResults[res.id] = res.result
		}
	}

	jsonOutput, err := json.MarshalIndent(allResults, "", " ")
	if err != nil {
		return C.CString(fmt.Sprintf("error marshaling JSON: %v", err))
	}

	atomic.AddInt32(&allocCount, 1)
	return C.CString(string(jsonOutput))

}
