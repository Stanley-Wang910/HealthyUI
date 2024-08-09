package main

import (
	"flag"
	"log"
	"strings"

	"github.com/joho/godotenv"
	// "google.golang.org/api/youtube/v3"
)

func main() {
	errEnv := godotenv.Load()
	if errEnv != nil {
		// Located root dir
		log.Fatalf("Error loading .env file: %v", errEnv)
	}

	// returns pointer (*queries) to command-line args
	queries := flag.String("queries", "", "Comma seperated list of query strings for factchecktools API")
	// Parse arguments
	flag.Parse() // ["query1","query2","query3"]

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

// func getOAuthClient(ctx context.Context) (*oauth2.Token, error) {

// 	ClientID := os.Getenv("CLIENT_ID")
// 	ClientSecret := os.Getenv("CLIENT_SECRET")

// 	conf := &oauth2.Config{
// 		ClientID:     ClientID,
// 		ClientSecret: ClientSecret,
// 		RedirectURL:  "localhost:5000/test", // Fix later
// 		Scopes:       []string{"https://www.googleapis.com/auth/factchecktools"},
// 		Endpoint: oauth2.Endpoint{
// 			AuthURL:  "https://accounts.google.com/o/oauth2/auth",
// 			TokenURL: "https://accounts.google.com/o/oauth2/token",
// 		},
// 	}

// 	verifier := oauth2.GenerateVerifier()

// 	url := conf.AuthCodeURL("state", oauth2.AccessTypeOffline, oauth2.S256ChallengeOption(verifier))
// 	fmt.Printf("Visit the URL for auth dialog: %v", url)

// 	var code string
// 	if _, err := fmt.Scan(&code); err != nil {
// 		return nil, fmt.Errorf("failed to read code: %v", err)
// 	}
// 	tok, err := conf.Exchange(ctx, code, oauth2.VerifierOption(verifier))
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to retrieve token: %v", err)
// 	}

// 	return tok, nil
// }

// func youtubeVideoList(id string) {

// 	ctx := context.Background()

// 	googleApiKey := os.Getenv("GOOGLE_API_KEY")
// 	if googleApiKey == "" {
// 		fmt.Errorf("GOOGLE_API_KEY not set in .env")
// 	}

// 	svc, err := youtube.NewService(ctx, option.WithAPIKey(googleApiKey))

// 	if err != nil {
// 		fmt.Errorf("failed to create service: %v", err)
// 	}

// 	call := svc.Videos.List()

// 	call.Id(id)

// 	response, err := call.Do()

// 	if err != nil {
// 		fmt.Errorf("failed to execute GET request: %v", err)
// 	}

// }
