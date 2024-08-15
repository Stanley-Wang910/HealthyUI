package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sync"
	"sync/atomic"

	"github.com/joho/godotenv"
)

// #include <stdbool.h>
// #include <stdint.h>
// #include <stdio.h>
// #include <stdlib.h>
import "C"

type YoutubeAPIRes struct {
	// Kind     string   `json:"kind"`
	// Etag     string   `json:"etag"`
	Items []Item `json:"items,omitempty"`
	// PageInfo PageInfo `json:"pageInfo"`
	Error string `json:"error,omitempty"`
}

type Item struct {
	// Kind         string       `json:"kind"`
	// Etag         string       `json:"etag"`
	ID           string       `json:"id"`
	Snippet      Snippet      `json:"snippet"`
	Statistics   Statistics   `json:"statistics"`
	TopicDetails TopicDetails `json:"topicDetails"`
}

type Snippet struct {
	PublishedAt  string     `json:"publishedAt"`
	ChannelID    string     `json:"channelId"`
	Title        string     `json:"title"`
	Description  string     `json:"description"`
	Thumbnails   Thumbnails `json:"thumbnails"`
	ChannelTitle string     `json:"channelTitle"`
	Tags         []string   `json:"tags"`
	CategoryID   string     `json:"categoryId"`
	// LiveBroadcastContent string     `json:"liveBroadcastContent"`
	// DefaultLanguage      string     `json:"defaultLanguage"`
	// Localized            Localized  `json:"localized"`
	// DefaultAudioLanguage string     `json:"defaultAudioLanguage"`
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
	DislikeCount  int    `json:"dislikeCount"`
	FavoriteCount string `json:"favoriteCount"`
	CommentCount  string `json:"commentCount"`
}

type DislikeAPI struct {
	ID          string  `json:"id"`
	DateCreated string  `json:"dateCreated"`
	Likes       int     `json:"likes"`
	RawDislikes int     `json:"rawDislikes"`
	RawLikes    int     `json:"rawLikes"`
	Dislikes    int     `json:"dislikes"`
	Rating      float64 `json:"rating"`
	ViewCount   int     `json:"viewCount"`
	Deleted     bool    `json:"deleted"`
}

type TopicDetails struct {
	TopicCategories []string `json:"topicCategories"`
}

type PageInfo struct {
	TotalResults   int64 `json:"totalResults"`
	ResultsPerPage int64 `json:"resultsPerPage"`
}

type YoutubeMostReplayedRes struct {
	// Kind  string `json:"kind"`
	// Etag  string `json:"etag"`
	Items []MRItem `json:"items"`
}

type MRItem struct {
	// Kind         string       `json:"kind"`
	// Etag         string       `json:"etag"`
	ID           string       `json:"id"`
	MostReplayed MostReplayed `json:"mostReplayed"`
}

type MostReplayed struct {
	Markers []Marker `json:"markers"`
	// TimedMarkerDecorations []TimedMarkerDecoration `json:"timedMarkerDecorations"`
}

type Marker struct {
	StartMillis              int64   `json:"startMillis"`
	IntensityScoreNormalized float64 `json:"intensityScoreNormalized"`
}

// type TimedMarkerDecoration struct {
// 	VisibleTimeRangeStartMillis int64 `json:"visibleTimeRangeStartMillis"`
// 	VisibleTimeRangeEndMillis   int64 `json:"visibleTimeRangeEndMillis"`
// }

type TranscriptRes struct {
	Source     string       `json:"source"`
	Transcript []Transcript `json:"transcript"`
}

type Transcript struct {
	Duration float64 `json:"duration"`
	Start    float64 `json:"start"`
	Text     string  `json:"text"`
}

type CombinedDataRes struct {
	Transcript   TranscriptRes
	MostReplayed YoutubeMostReplayedRes
}

// String key is video ID
type RelevantTranscriptRes map[string]RelTranscript

type RelTranscript struct {
	Source string `json:"source"`
	Text   string `json:"text"`
}

func youtubeGET(id string, googleApiKey string) (YoutubeAPIRes, error) {
	// assign struct obj for GET response
	var youtubeResponse YoutubeAPIRes
	var dislikeResponse DislikeAPI

	var wg sync.WaitGroup

	errChan := make(chan error, 2) // Error channel to collect errs from 2 goroutines

	wg.Add(2)

	go func() {
		defer wg.Done()
		req, err := http.NewRequest("GET", "https://www.googleapis.com/youtube/v3/videos", nil)

		if err != nil {
			errChan <- fmt.Errorf("error with GET youtube request: %v", err)
			return // Collect 1 / 2 errors
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
			errChan <- fmt.Errorf("failed to execute HTTP request for ID: %s: %v", id, err)
			return // Collect 1 / 2 errors
		}

		defer res.Body.Close()

		body, err := io.ReadAll(res.Body)
		if err != nil {
			errChan <- fmt.Errorf("failed to read response body for ID: %s: %v", id, err)
			return // Collect 1 / 2 errors
		}

		err = json.Unmarshal(body, &youtubeResponse)
		if err != nil {
			errChan <- fmt.Errorf("failed to unmarshal JSON response for ID: %s: %v", id, err)
			return // Collect 1 / 2 errors
		}
	}()

	go func() {
		defer wg.Done()
		req, err := http.NewRequest("GET", "https://returnyoutubedislikeapi.com/votes?", nil)

		if err != nil {
			errChan <- fmt.Errorf("error with GET youtube dislike request: %v", err)
			return // Collect 2 / 2 errors
		}
		q := req.URL.Query()
		q.Add("videoId", id)

		req.URL.RawQuery = q.Encode()

		req.Header.Add("Accept", "application/json")

		client := &http.Client{}
		res, err := client.Do(req)
		if err != nil {
			errChan <- fmt.Errorf("failed to execute HTTP request for ID: %s: %v", id, err)
			return // Collect 2 / 2 errors
		}

		defer res.Body.Close() // close body after reading

		body, err := io.ReadAll(res.Body)
		if err != nil {
			errChan <- fmt.Errorf("failed to read response body for ID: %s: %v", id, err)
			return // Collect 2 / 2 errors
		}

		err = json.Unmarshal(body, &dislikeResponse)
		if err != nil {
			errChan <- fmt.Errorf("failed to unmarshal JSON response for ID: %s: %v", id, err)
			return // Collect 2 / 2 errors
		}
	}()

	wg.Wait()
	close(errChan)

	for err := range errChan {
		if err != nil {
			return youtubeResponse, err
		}
	}

	// Append dislikes to youtubeResponse

	if len(youtubeResponse.Items) > 0 {
		// Convert int to string
		youtubeResponse.Items[0].Statistics.DislikeCount = dislikeResponse.Dislikes
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

	videos := make(chan struct {
		id    string
		err   error
		video YoutubeAPIRes
	}, len(ids))

	for _, id := range ids {
		wg.Add(1)
		go func(id string) {
			defer wg.Done()
			video, err := youtubeGET(id, googleApiKey)

			videos <- struct {
				id    string
				err   error
				video YoutubeAPIRes
			}{id, err, video}
		}(id)
	}

	go func() {
		// Wait for concurrent goroutines to finish
		wg.Wait()
		close(videos)
	}()

	allVideos := make(map[string]YoutubeAPIRes)

	for v := range videos {
		if v.err != nil {
			allVideos[v.id] = YoutubeAPIRes{Error: v.err.Error()}
		} else {
			allVideos[v.id] = v.video
		}
	}

	jsonOutput, err := json.MarshalIndent(allVideos, "", " ")
	if err != nil {
		return C.CString(fmt.Sprintf("error marshaling JSON: %v", err))
	}

	atomic.AddInt32(&allocCount, 1)
	return C.CString(string(jsonOutput))

}

func youtubeGETmostReplayed(id string) (YoutubeMostReplayedRes, error) {
	var youtubeMRRes YoutubeMostReplayedRes

	req, err := http.NewRequest("GET", "https://yt.lemnoslife.com/videos?part=mostReplayed", nil)

	if err != nil {
		return youtubeMRRes, fmt.Errorf("error with GET youtube MR request: %v", err)
	}
	q := req.URL.Query()
	q.Add("id", id)

	req.URL.RawQuery = q.Encode()

	req.Header.Add("Accept", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return youtubeMRRes, fmt.Errorf("failed to execute HTTP request for ID: %s: %v", id, err)
	}

	defer res.Body.Close() // close body after reading

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return youtubeMRRes, fmt.Errorf("failed to read response body for ID: %s: %v", id, err)
	}

	err = json.Unmarshal(body, &youtubeMRRes)
	if err != nil {
		return youtubeMRRes, fmt.Errorf("failed to unmarshal JSON response for ID: %s: %v", id, err)
	}

	return youtubeMRRes, nil
}

func youtubeGETtranscript(id string, port string) (TranscriptRes, error) {
	var transcriptResponse TranscriptRes
	// Subject to change with domain / port

	// reqUrl := fmt.Sprintf("http://localhost:%s", port)
	reqUrl := "https://backend.staging-5em2ouy-6eam53tw44i6e.ca-1.platformsh.site"

	req, err := http.NewRequest("GET", reqUrl+"/yt/transcript", nil)

	if err != nil {
		return transcriptResponse, fmt.Errorf("error with GET youtube transcript request: %v", err)
	}
	q := req.URL.Query()
	q.Add("id", id)

	req.URL.RawQuery = q.Encode()

	req.Header.Add("Accept", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return transcriptResponse, fmt.Errorf("failed to execute HTTP request for ID: %s: %v", id, err)
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return transcriptResponse, fmt.Errorf("failed to read response body for ID: %s: %v", id, err)
	}

	// fmt.Print(string(body))

	err = json.Unmarshal(body, &transcriptResponse)
	if err != nil {
		return transcriptResponse, fmt.Errorf("failed to unmarshal JSON response for ID: %s: %v", id, err)
	}

	return transcriptResponse, nil
}

//export YoutubeGETtranscriptMostReplayedCC
func YoutubeGETtranscriptMostReplayedCC(_ids **C.char, idCount C.int) *C.char {
	ids := CStrArrayToSlice(_ids, idCount)

	// load backend port from .env file
	err := godotenv.Load()
	if err != nil {
		return C.CString(fmt.Sprintf("Error loading .env file: %v", err))
	}

	port := os.Getenv("PORT")
	if port == "" {
		return C.CString("Error: PORT is empty")
	}

	var wg sync.WaitGroup

	combinedRes := make(chan struct {
		id       string
		err      error
		combined CombinedDataRes
	}, len(ids))

	for _, id := range ids {
		wg.Add(1)
		go func(id string) {
			defer wg.Done()
			var combined CombinedDataRes
			var err1, err2 error

			// Run Transcript and Most Replayed in Parallel
			var innerWg sync.WaitGroup
			innerWg.Add(2)

			go func() {
				defer innerWg.Done()
				combined.Transcript, err1 = youtubeGETtranscript(id, port)
			}()

			go func() {
				defer innerWg.Done()
				combined.MostReplayed, err2 = youtubeGETmostReplayed(id)
			}()

			innerWg.Wait()

			// Combine errors
			var err error
			if err1 != nil {
				err = err1
			}
			if err2 != nil {
				if err == nil {
					err = err2
				} else {
					err = fmt.Errorf("%v; %v", err, err2)
				}
			}

			// Pass into channel
			combinedRes <- struct {
				id       string
				err      error
				combined CombinedDataRes
			}{id, err, combined}
		}(id)
	}

	go func() {
		wg.Wait()
		close(combinedRes)
	}()

	allResults := make(map[string]CombinedDataRes)

	for c := range combinedRes {
		if c.err != nil {
			fmt.Printf("Error for id: %s : %v\n", c.id, c.err)
		}
		allResults[c.id] = c.combined
	}

	jsonOutput, err := json.MarshalIndent(allResults, "", " ")
	if err != nil {
		return C.CString(fmt.Sprintf("error marshalling JSON: %v", err))
	}

	atomic.AddInt32(&allocCount, 1)
	return C.CString(string(jsonOutput))
}

func youtubeGETrelevantTranscript(id string, port string) (RelevantTranscriptRes, error) {
	var relevantTranscript RelevantTranscriptRes

	// reqUrl := fmt.Sprintf("http://localhost:%s", port)
	reqUrl := "https://backend.staging-5em2ouy-6eam53tw44i6e.ca-1.platformsh.site"

	req, err := http.NewRequest("GET", reqUrl+"/yt/relevant-transcript", nil)

	if err != nil {
		return relevantTranscript, fmt.Errorf("error with GET youtube rel transcript request: %v", err)
	}
	q := req.URL.Query()
	q.Add("id", id)

	req.URL.RawQuery = q.Encode()

	req.Header.Add("Accept", "application/json")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return relevantTranscript, fmt.Errorf("failed to execute HTTP request for ID: %s: %v", id, err)
	}

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return relevantTranscript, fmt.Errorf("failed to read response body for ID: %s: %v", id, err)
	}

	// fmt.Print(string(body))

	err = json.Unmarshal(body, &relevantTranscript)
	if err != nil {
		return relevantTranscript, fmt.Errorf("failed to unmarshal JSON response for ID: %s: %v", id, err)
	}

	return relevantTranscript, nil
}

//export YoutubeGETrelevantTranscriptCC
func YoutubeGETrelevantTranscriptCC(_ids **C.char, idCount C.int) *C.char {
	ids := CStrArrayToSlice(_ids, idCount)

	// load backend port from .env file
	err := godotenv.Load()
	if err != nil {
		return C.CString(fmt.Sprintf("Error loading .env file: %v", err))
	}

	port := os.Getenv("PORT")
	if port == "" {
		return C.CString("Error: PORT is empty")
	}

	var wg sync.WaitGroup

	relevantTranscripts := make(chan struct {
		id                 string
		err                error
		relevantTranscript RelevantTranscriptRes
	}, len(ids))

	for _, id := range ids {
		wg.Add(1)
		go func(id string) {
			defer wg.Done()

			relevantTranscript, err := youtubeGETrelevantTranscript(id, port)

			relevantTranscripts <- struct {
				id                 string
				err                error
				relevantTranscript RelevantTranscriptRes
			}{id, err, relevantTranscript}
		}(id)
	}

	go func() {
		// Wait for concurrent goroutines to finish
		wg.Wait()
		close(relevantTranscripts)
	}()

	allRelTranscripts := make(map[string]RelevantTranscriptRes)

	for r := range relevantTranscripts {
		if r.err != nil {
			fmt.Printf("error for id: %s : %v\n", r.id, r.err)
		}
		allRelTranscripts[r.id] = r.relevantTranscript
	}

	jsonOutput, err := json.MarshalIndent(allRelTranscripts, "", " ")
	if err != nil {
		return C.CString(fmt.Sprintf("error marshaling JSON: %v", err))
	}

	atomic.AddInt32(&allocCount, 1)
	return C.CString(string(jsonOutput))
}
