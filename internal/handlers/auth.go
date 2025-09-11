package handlers

import (
	"encoding/json"
	"net/http"
)

// AuthRequest represents the expected JSON payload from the frontend.
type AuthRequest struct {
	Token string `json:"token"` // The social media auth token (e.g., Google ID token)
}

// AuthResponse represents the JSON payload to send back to the frontend.
type AuthResponse struct {
	WalletAddress string `json:"walletAddress"` // The public address of the created wallet
}

// AuthHandler handles user authentication and wallet creation.
// It receives a social token, uses Openfort to create a wallet, and returns the wallet address.
func AuthHandler(w http.ResponseWriter, router *http.Request) {
	// Ensure the request method is POST
	if router.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Decode the JSON request body into the AuthRequest struct
	var req AuthRequest
	err := json.NewDecoder(router.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Simple validation to ensure the token is not empty
	if req.Token == "" {
		http.Error(w, "Token is required", http.StatusBadRequest)
		return
	}

	// TODO: Create an Openfort client instance.
	// Pass the Openfort API key to this client.
	// client := openfort.NewClient(os.Getenv("OPENFORT_API_KEY"))

	// TODO: Call the Openfort SDK to create or retrieve the wallet.
	// This is where Openfort Go SDK is consulted for the documentation for the exact function.
	// It might look something like this:
	//
	// wallet, err := client.Players.CreateEmbeddedWallet(req.Token)
	//
	// Handle the specific logic for your chosen social provider.

	// Placeholder for the wallet address you would get from Openfort
	walletAddress := "0x123...abc" // This should be replaced by the actual wallet address from the SDK

	// Prepare the success response
	res := AuthResponse{
		WalletAddress: walletAddress,
	}

	// Set the Content-Type header to application/json
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode and send the JSON response
	json.NewEncoder(w).Encode(res)
}