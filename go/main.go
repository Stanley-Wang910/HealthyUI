package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"
	"sync"

	"github.com/joho/godotenv"
	factchecktools "google.golang.org/api/factchecktools/v1alpha1"
	"google.golang.org/api/option"
)

type ClaimReview struct {
	PublisherName string `json:"publisher_name"`
	PublisherSite string `json:"publisher_site"`
	Text          string `json:"text"`
	URL           string `json:"url"`
}

type Claim struct {
	ClaimBy     string        `json:"claim_by"`
	Text        string        `json:"text"`
	ClaimDate   string        `json:"claim_date"`
	ClaimReview []ClaimReview `json:"claim_review"`
}

type FactCheckResult struct {
	Query          string  `json:"query"`
	NumberofClaims int     `json:"number_of_claims"`
	NextPageToken  string  `json:"next_page_token"`
	Claims         []Claim `json:"claims"`
}

func main() {
	errEnv := godotenv.Load()
	if errEnv != nil {
		log.Fatalf("Error loading .env file: %v", errEnv)
	}

	// returns pointer (*queries) to command-line args
	queries := flag.String("queries", "", "Comma seperated list of query strings for factchecktools API")
	// Parse arguments
	flag.Parse() // "query1","query2","query3"

	// Dereference pointer for string value, err handle if empty
	if *queries == "" {
		log.Fatalln("At least one query string is required")
	}

	// Tokenize args by "," into []string (dynamically typed, size not defined at compile time)
	queryList := strings.Split(*queries, ",")

	// for i, q := range queryList {
	// 	fmt.Printf("query is %d, %s\n", i, q)
	// }

	err := factCheckGETConcurrent(queryList)
	if err != nil {
		log.Fatalln("Error in factCheckGETConcurrent:", err)
	}
}

// Return struct FactCheckResult obj and error value
func factCheckGET(query string) (FactCheckResult, error) {
	// Service setup
	// Load env
	ctx := context.Background()
	googleApiKey := os.Getenv("GOOGLE_API_KEY")
	if googleApiKey == "" {
		return FactCheckResult{}, fmt.Errorf("GOOGLE_API_KEY not set in .env")
	}
	// Use Google API Key for Auth Currently
	svc, err := factchecktools.NewService(ctx, option.WithAPIKey(googleApiKey))

	if err != nil {
		return FactCheckResult{}, fmt.Errorf("failed to create service: %v", err)
	}

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
			ClaimBy:     c.Claimant,
			Text:        c.Text,
			ClaimDate:   c.ClaimDate,
			ClaimReview: make([]ClaimReview, len(c.ClaimReview)), // Build ClaimReview Struct in nested loop
		}
		for j, r := range c.ClaimReview {
			claim.ClaimReview[j] = ClaimReview{
				PublisherName: r.Publisher.Name,
				PublisherSite: r.Publisher.Site,
				Text:          r.TextualRating,
				URL:           r.Url,
			}
		}
		result.Claims[i] = claim
	}

	return result, nil
}

func factCheckGETConcurrent(queries []string) error {
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
			result, err := factCheckGET(q)
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
	allResults := make(map[string]interface{})

	// Processing of results channel starts immediately after starting go routines
	// Runs alongside API calls, until wg == 0 and channel closes
	for res := range results { // Passing struct values sent to results channel
		if res.err != nil {
			allResults[res.query] = fmt.Sprintf("Error: %v", res.err) // Sprintf to return error string
		} else {
			allResults[res.query] = res.result
		}
	}

	// Convert map into JSON-formatted string with indents and newlines
	jsonOutput, err := json.MarshalIndent(allResults, "", " ")
	if err != nil {
		return fmt.Errorf("error marshaling JSON: %v", err)
	}

	fmt.Println(string(jsonOutput))
	return nil
}
