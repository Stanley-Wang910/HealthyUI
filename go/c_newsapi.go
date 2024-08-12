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

type NewsAPIResponse struct {
	Query        string `json:"query"`
	Status       string `json:"status"`
	TotalResults int    `json:"totalResults"`
	Articles     []struct {
		Source struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		} `json:"source"`
		Author      string `json:"author"`
		Title       string `json:"title"`
		Description string `json:"description"`
		URL         string `json:"url"`
		// URLToImage  string `json:"urlToImage"`
		PublishedAt string `json:"publishedAt"`
		Content     string `json:"content"`
	} `json:"articles"`
}

func newsApiGET(query string, newsApiKey string) (NewsAPIResponse, error) {
	// assign struct obj for GET response
	var newsResponse NewsAPIResponse

	req, err := http.NewRequest("GET", "https://newsapi.org/v2/everything", nil)
	if err != nil {
		return newsResponse, fmt.Errorf("error with GET news request: %v", err)
	}

	q := req.URL.Query()
	// Add query parameters here or pass them in
	q.Add("q", query)
	q.Add("pageSize", "5")
	q.Add("language", "en")
	// q.Add("sortBy", "relevancy")
	// searchIn : title, description, content default is all
	// sources : comma separated string (max 20)
	// domains : comma separated string
	// excludeDomains : comma separated string
	// from : date in ISO 8601 format e.g. 2024-08-09 or 2024-08-09T17:30:00
	// to : date in ISO 8601 format e.g. 2024-08-09 or 2024-08-09T17:30:00
	// language: en
	// sortBy: relevancy, popularity, publishedAt
	// pageSize: integer
	// page: integer

	req.URL.RawQuery = q.Encode()

	req.Header.Set("Authorization", newsApiKey)
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return newsResponse, fmt.Errorf("failed to execute HTTP request for query: %s: %v", query, err)

	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return newsResponse, fmt.Errorf("error reading response body for query: %s: %v", query, err)
	}

	newsResponse.Query = req.URL.String()

	// Attempt deserialization (convert JSON to struct)
	// Looks through fields in struct obj, tries to find matching JSON string/int
	err = json.Unmarshal(body, &newsResponse) // body = []bytes, &newsResponse = pointer to struct
	if err != nil {
		return newsResponse, fmt.Errorf("error unmarshaling JSON response for query: %s: %v", query, err)
	}

	return newsResponse, nil
}

//export NewsApiGETConcurrent
func NewsApiGETConcurrent(_queries **C.char, queryCount C.int, _newsApiKey *C.char) *C.char {
	// Free all memory allocated by C.CString
	/* unsafe.Slice doc:https://pkg.go.dev/unsafe
	func Slice(ptr *ArbitraryType, len IntegerType) []ArbitraryType
	The function Slice returns a slice whose underlying array starts at
	ptr and whose length and capacity are len.	*/

	queries := CStrArrayToSlice(_queries, queryCount)

	newsApiKey := C.GoString(_newsApiKey)
	if newsApiKey == "" {
		return C.CString("Error: NEWS_API_KEY is empty")
	}

	var wg sync.WaitGroup

	results := make(chan struct {
		query  string
		result NewsAPIResponse
		err    error
	}, len(queries))

	for _, query := range queries {
		wg.Add(1) // Increment counter before starting a call
		// Start multiple go routines, each making API GET request for their query
		go func(q string) {
			defer wg.Done() // Decrement counter when call finishes
			result, err := newsApiGET(q, newsApiKey)
			results <- struct {
				query  string
				result NewsAPIResponse
				err    error
			}{q, result, err}
		}(query) // Pass query into go func() as q
	}

	go func() {
		wg.Wait()
		close(results)
	}()

	allResults := make(map[string]NewsAPIResponse)

	for res := range results { // Passing struct values sent to results channel
		if res.err != nil {
			fmt.Printf("error for one query: %s : %v\n", res.query, res.err)
		} else {
			allResults[res.query] = res.result
		}
	}

	jsonOutput, err := json.MarshalIndent(allResults, "", " ")
	if err != nil {
		return C.CString(fmt.Sprintf("error marshaling JSON: %v", err))
	}

	atomic.AddInt32(&allocCount, 1)
	return C.CString(string(jsonOutput))

}
