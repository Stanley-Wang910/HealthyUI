package main

import (
	"context"
	"encoding/json"
	"fmt"

	// "os"
	"sync"

	"unsafe"

	factchecktools "google.golang.org/api/factchecktools/v1alpha1"
	"google.golang.org/api/option"
)

// #include <stdio.h>
// #include <stdlib.h>
import "C"

//Import Unsafe after C for C.GoString

type Main struct {
	Claims []Claim `json:"claims"`
}

type Claim struct {
	Text        string        `json:"text"`
	Claimant    string        `json:"claimant,omitempty"`
	ClaimDate   string        `json:"claimDate,omitempty"`
	ClaimReview []ClaimReview `json:"claimReview"`
}

type ClaimReview struct {
	PublisherName string `json:"name"`
	PublisherSite string `json:"site"`
	URL           string `json:"url"`
	Title         string `json:"title"`
	TextualRating string `json:"textualRating"`
	// LanguageCode  string `json:"languageCode"`
	ReviewDate string `json:"reviewDate,omitempty"`
}

type FactCheckResult struct {
	Query          string  `json:"query"`
	NumberofClaims int     `json:"number_of_claims"`
	NextPageToken  string  `json:"next_page_token"`
	Claims         []Claim `json:"claims"`
}

func factCheckGET(query string, svc *factchecktools.Service) (FactCheckResult, error) {
	// Service setup
	// Assign API Call on GET https://factchecktools.googleapis.com/v1alpha1/claims:search to `call`
	call := svc.Claims.Search()

	// Assign query header
	call.Query(query)
	call.LanguageCode("en-US")

	// Make the GET request
	response, err := call.Do()

	if err != nil {
		return FactCheckResult{}, fmt.Errorf("failed to execute GET request: %v", err)
	}

	// Build result struct
	result := FactCheckResult{
		Query:          query,
		NumberofClaims: len(response.Claims),
		NextPageToken:  response.NextPageToken,
		Claims:         make([]Claim, len(response.Claims)),
	}

	for i, c := range response.Claims { // Like Python enum
		claim := Claim{
			Text:        c.Text,
			Claimant:    c.Claimant,
			ClaimDate:   c.ClaimDate,
			ClaimReview: make([]ClaimReview, len(c.ClaimReview)), // Build ClaimReview Struct in nested loop
		}
		for j, r := range c.ClaimReview {
			claim.ClaimReview[j] = ClaimReview{
				PublisherName: r.Publisher.Name,
				PublisherSite: r.Publisher.Site,
				URL:           r.Url,
				Title:         r.Title,
				TextualRating: r.TextualRating,
				ReviewDate:    r.ReviewDate,
			}
		}
		result.Claims[i] = claim
	}

	return result, nil
}

//export FactCheckGETConcurrent
func FactCheckGETConcurrent(_queries **C.char, queryCount C.int, _googleApiKey *C.char) *C.char {
	// Free all memory allocated by C.CString

	// func FactCheckGETConcurrent(queries []string) error {
	qSlice := unsafe.Slice(_queries, int(queryCount))
	queries := make([]string, 0, int(queryCount))
	for i := 0; i < int(queryCount); i++ {
		if qSlice[i] != nil {
			queries = append(queries, C.GoString(qSlice[i]))
		}
	}
	googleApiKey := C.GoString(_googleApiKey)
	if googleApiKey == "" {
		return C.CString("Error: GOOGLE_API_KEY is empty")
	}

	ctx := context.Background()

	// tok, err := getOAuthClient(ctx)
	// if err != nil {
	// 	return FactCheckResult{}, fmt.Errorf("failed to get OAuth client: %v", err)
	// }

	// svc, err := factchecktools.NewService(ctx, option.WithTokenSource(oauth2.StaticTokenSource(tok)))

	// googleApiKey := os.Getenv("GOOGLE_API_KEY")
	// if googleApiKey == "" {
	// 	return fmt.Errorf("GOOGLE_API_KEY not set in .env")
	// }

	svc, err := factchecktools.NewService(ctx, option.WithAPIKey(googleApiKey))

	if err != nil {
		return C.CString(fmt.Sprintf("failed to create service: %v", err))
	}

	// Create wg Wait Group: used to wait for concurrent calls to finish before returning
	var wg sync.WaitGroup

	// Create buffered channel to store as many results as len(queries)
	results := make(chan struct {
		query  string
		result FactCheckResult
		err    error
	}, len(queries))

	for _, query := range queries {
		wg.Add(1) // Increment counter before starting a call
		// Start multiple go routines, each making API GET request for their query
		go func(q string) {
			defer wg.Done() // Decrement counter when call finishes
			result, err := factCheckGET(q, svc)
			results <- struct {
				query  string
				result FactCheckResult
				err    error
			}{q, result, err}
		}(query) // Pass query into go func() as q
	}

	go func() {
		wg.Wait() // Wait until wg counter reaches 0 before closing channel
		close(results)
	}()

	// Map of results including successful API Calls and error strings
	allResults := make(map[string]FactCheckResult) // All values in this map must be of type FactCheckResult

	// Processing of results channel starts immediately after starting go routines
	// Runs alongside API calls, until wg == 0 and channel closes
	for res := range results { // Passing struct values sent to results channel
		if res.err != nil {
			fmt.Printf("Error for one query: %s : %v\n", res.query, res.err)
		} else {
			allResults[res.query] = res.result
		}
	}

	// Convert map into JSON-formatted string with indents and newlines
	jsonOutput, err := json.MarshalIndent(allResults, "", " ")
	if err != nil {
		return C.CString(fmt.Sprintf("error marshaling JSON: %v", err))
	}

	return C.CString(string(jsonOutput))
}

//export FreeResult
func FreeResult(result *C.char) {
	C.free(unsafe.Pointer(result))
}

func main() {}
