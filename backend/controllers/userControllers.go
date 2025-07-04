package controllers

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("secret_key") // Replace with your actual secret key

func generateJWT(username string) (string, error) {

	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)), // Token valid for 72 hours
		Issuer:    "app",
		Subject:   username,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(jwtKey))

	if err != nil {
		return "", err
	}
	return tokenString, nil
}
func CreateUser(w http.ResponseWriter, r *http.Request) {
	collection := config.Database.Collection("users")
	var user models.User
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	err := collection.FindOne(r.Context(), map[string]string{"username": user.Username}).Err()
	if err == nil {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}
	//encrypt the password
	//import bcrypt package and use it to hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedPassword)

	result, err := collection.InsertOne(r.Context(), user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if result.InsertedID == nil {
		http.Error(w, "Error inserting user", http.StatusInternalServerError)
		return
	}

	access_token, err := generateJWT(user.Username)
	if err != nil {
		http.Error(w, "Error generating JWT", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"message":      "User created successfully",
		"access_token": access_token,
	}
	json.NewEncoder(w).Encode(response)
}

func AuthenticateUser(w http.ResponseWriter, r *http.Request) {
	collection := config.Database.Collection("users")
	var user models.User
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	var foundUser models.User
	err := collection.FindOne(r.Context(), map[string]string{"username": user.Username}).Decode(&foundUser)
	if err != nil {
		http.Error(w, "Username doesn't exist", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(user.Password))
	if err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	access_token, err := generateJWT(foundUser.Username)
	if err != nil {
		http.Error(w, "Error generating JWT", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"message":      "Authentication successful",
		"access_token": access_token,
	}
	json.NewEncoder(w).Encode(response)
}
