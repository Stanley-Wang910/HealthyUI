package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func youtube() {

	googleApiKey := os.Getenv("GOOGLE_API_KEY")
	if googleApiKey == "" {
		panic("GOOGLE_API_KEY not set in .env")
	}
	url := fmt.Sprintf("https://www.googleapis.com/youtube/v3/videos?part=topicDetails%%2Csnippet%%2Cstatistics&id=88cM3AmutRU&key=%s", googleApiKey)

	req, _ := http.NewRequest("GET", url, nil)

	req.Header.Add("Accept", "*/*")

	res, err := http.DefaultClient.Do(req)

	if err != nil {
		panic(err)
	}

	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(res)
	fmt.Println(string(body))
}
