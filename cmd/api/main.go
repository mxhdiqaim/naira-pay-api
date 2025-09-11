package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"github.com/mxhdiqaim/naira-pay-api/internal/handlers"
)

// Main function to start the server
func main() {
	// Load .env file. If in production, load .env.prod
	env := os.Getenv("GO_ENV")
    envFile := ".env"

	if env == "production" {
        envFile = ".env.prod"
    }
	// Load environment variables
	err := godotenv.Load(envFile)

	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Create a new Chi router
	router := chi.NewRouter()

	// Define API routes
	router.Post("/auth/social", handlers.AuthHandler)
	// router.Get("/wallet/balance", GetBalanceHandler)
	// router.Post("/wallet/send", SendTransactionHandler)
	// router.Get("/wallet/history", GetHistoryHandler)
	
	port := os.Getenv("PORT")
	 if port == "" {
       log.Fatalf("PORT environment variable is not set")
    }

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
        log.Fatalf("Could not start server: %s\n", err)
    }

}