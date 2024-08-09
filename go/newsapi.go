package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type NewsAPIResponse struct {
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
		URLToImage  string `json:"urlToImage"`
		PublishedAt string `json:"publishedAt"`
		// Content     string `json:"content"`
	} `json:"articles"`
}

func auth() (string, error) {
	newsApiKey := os.Getenv("NEWS_API_KEY")
	if newsApiKey == "" {
		return "", fmt.Errorf("failed to get NEWS_API_KEY from .env")
	}
	return newsApiKey, nil
}

func newsApiGETEverything() error {

	newsApiKey, err := auth()
	if err != nil {
		return fmt.Errorf("error: %v", err)
	}
	req, err := http.NewRequest("GET", "https://newsapi.org/v2/everything", nil)
	if err != nil {
		return fmt.Errorf("error: %v", err)
	}

	q := req.URL.Query()

	// Add query parameters here or pass them in
	q.Add("q", "bitcoin")
	q.Add("pageSize", "5")

	req.URL.RawQuery = q.Encode()

	req.Header.Set("Authorization", newsApiKey)
	req.Header.Set("Accept", "application/json")

	// params =
	// q

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("error: %v", err)

	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("error: %v", err)
	}

	// assign struct obj for GET response
	var newsResponse NewsAPIResponse

	// Attempt deserialization (convert JSON to struct)
	// Looks through fields in struct obj, tries to find matching JSON string/int
	err = json.Unmarshal(body, &newsResponse) // body = []bytes, &newsResponse = pointer to struct
	if err != nil {
		return fmt.Errorf("error unmarshaling JSON string: %v", err)
	}

	// Return JSON Formatted output
	jsonOutput, err := json.MarshalIndent(newsResponse, "", " ")
	if err != nil {
		return fmt.Errorf("error marshaling JSON: %v", err)
	}

	fmt.Println(string(jsonOutput))

	return nil
}
