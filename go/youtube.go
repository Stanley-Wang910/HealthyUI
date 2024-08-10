package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	// "sync"
)

func youtube(id string) error {
	googleApiKey := os.Getenv("GOOGLE_API_KEY")
	if googleApiKey == "" {
		panic("GOOGLE_API_KEY not set in .env")
	}

	url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/videos?part=topicDetails%%2Csnippet%%2Cstatistics&id=%s&key=%s", id, googleApiKey)

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Accept", "*/*")

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		return fmt.Errorf("Client could not get response: %v", err)
	}

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))
	return nil
}

// func youtubeConcurrent(ids []string) error {

// 	var wg sync.WaitGroup

// 	results := make(chan struct {
// 		id   string
// 		err  error
// 		body string

// 	})
