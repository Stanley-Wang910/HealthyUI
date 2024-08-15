package main

// #include <stdbool.h>
// #include <stdint.h>
// #include <stdio.h>
// #include <stdlib.h>
import "C"

// import "fmt"

// import "fmt"

// Test Locally

func main() {
	// id := "ioqSvLqB46Y"
	// result, err := youtubeGETrelevantTranscript(id)
	// if err != nil {
	// 	fmt.Printf("Error in youtube GET: %v", err)
	// }
	// fmt.Println("Result:", result)

	// for _, env := range os.Environ() {
	// 	pair := strings.SplitN(env, "=", 2)
	// 	fmt.Printf("%s: %s\n", pair[0], pair[1])
	// }
	// queries := []string{"Tw9LWetS49k", "_ZTZGz1xusA", "Nkq_mI2PlM8", "Cl3izXcp86w"}
	// queryCount := len(queries)

	// // Convert Go strings to C strings
	// cQueries := make([]*C.char, queryCount)
	// for i, q := range queries {
	// 	cQueries[i] = C.CString(q)
	// }
	// defer func() {
	// 	for _, cStr := range cQueries {
	// 		C.free(unsafe.Pointer(cStr))
	// 	}
	// }()

	// // Convert the slice of C string pointers to a C-compatible format
	// cQueriesPtr := (**C.char)(unsafe.Pointer(&cQueries[0]))

	// // errEnv := godotenv.Load()
	// // if errEnv != nil {
	// // 	log.Fatalf("Error loading .env file: %v", errEnv)
	// // }

	// // Convert the result back to a Go string
	// goResult := C.GoString(result)

	// id := "ioqSvLqB46Y"
	// result, err := youtubeGETrelevantTranscript(id)
	// if err != nil {
	// 	fmt.Println("Whoopsies")
	// }
	// fmt.Println("Result:", result)

}

// tok, err := getOAuthClient(ctx)
// if err != nil {
// 	return FactCheckResult{}, fmt.Errorf("failed to get OAuth client: %v", err)
// }

// svc, err := factchecktools.NewService(ctx, option.WithTokenSource(oauth2.StaticTokenSource(tok)))

// googleApiKey := os.Getenv("GOOGLE_API_KEY")
// if googleApiKey == "" {
// 	return fmt.Errorf("GOOGLE_API_KEY not set in .env")
// }

// func main() {
// 	// Load needed before any function can get variables
//

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

// 		startTime := time.Now()
// 		err := factCheckGETConcurrent(queryList)
// 		fmt.Println("Finished factcheck in", time.Since(startTime))
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
