package main

// import (
// 	// "flag"
// 	"flag"
// 	"fmt"
// 	"log"

// 	"strings"

// 	"github.com/joho/godotenv"
// 	// "google.golang.org/api/youtube/v3"
// )

// func main() {
// 	// Load needed before any function can get variables
// 	errEnv := godotenv.Load()
// 	if errEnv != nil {
// 		log.Fatalf("Error loading .env file: %v", errEnv)
// 	}

// 	command := flag.String("command", "", "Command to run: factcheck, news, or youtube")
// 	flag.StringVar(command, "c", "", "Command to run: factcheck, news, or youtube")

// 	factCheckQueries := flag.String("q", "", "Comma seperated list of query strings for factchecktools API")

// 	ytVidId := flag.String("id", "", "Video ID to send to API")

// 	newsQuery := flag.String("n", "", "Comma seperated list of query strings for news API")

// 	// newsCmd := flag.NewFlagSet("news", flag.ExitOnError)

// 	// youtubeCmd := flag.NewFlagSet("youtube", flag.ExitOnError)

// 	// check CLI arg
// 	// if len(flag.Args()) < 1 {
// 	// 	fmt.Println("Expected 'factcheck', 'news' or 'youtube' subcommands")
// 	// 	return
// 	// }
// 	flag.Parse()

// 	if *command == "" {
// 		fmt.Println("Please provide a command: -c=factcheck, -c=news, or -c=youtube")
// 		return
// 	}

// 	// factcheck
// 	switch *command {
// 	case "factcheck":
// 		if *factCheckQueries == "" {
// 			log.Fatalln("At least one query string for factcheck is required")
// 		}

// 		// Tokenize args by "," into []string (dynamically typed, size not defined at compile time)
// 		queryList := strings.Split(*factCheckQueries, ",")

// 		err := factCheckGETConcurrent(queryList)
// 		if err != nil {
// 			log.Fatalln("Error in factCheckGETConcurrent:", err)
// 		}

// 	case "news":
// 		if *newsQuery == "" {
// 			log.Fatalln("At least one query string for news is required")
// 		}

// 		// Tokenize args by "," into []string (dynamically typed, size not defined at compile time)
// 		queryList := strings.Split(*newsQuery, ",")
// 		err := newsApiGETConcurrent(queryList)
// 		if err != nil {
// 			log.Fatalln("Error in newsAPI:", err)
// 		}

// 	case "youtube":
// 		if *ytVidId == "" {
// 			log.Fatalln("At least one Video ID for YouTube API is required")
// 		}
// 		err := youtube(*ytVidId)
// 		if err != nil {
// 			log.Fatalln("Error in youtube GET", err)
// 		}

// 	default:
// 		fmt.Println("Expected '-c=factcheck', '-c=news', or '-c=youtube'")
// 	}

// }

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
