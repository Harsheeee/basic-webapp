package controllers

import (
	"backend/config"
	"backend/models"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// CreateTodo handles the creation of a new Todo
func CreateTodo(w http.ResponseWriter, r *http.Request) {
	var todo models.Todo
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Set creation time

	// Insert the new todo into the database
	collection := config.Database.Collection("todos")
	result, err := collection.InsertOne(context.Background(), todo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert InsertedID to ObjectID and assign to todo.ID
	todo.ID = result.InsertedID.(primitive.ObjectID)

	// Respond with the created Todo in JSON format
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

// GetTodos handles fetching all Todos
func GetTodos(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	username := params.Get("username")
	var todos []models.Todo
	collection := config.Database.Collection("todos")

	// Fetch all todos from the database with username in todo
	cursor, err := collection.Find(context.Background(), bson.M{"username": username})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	// Iterate through all results and convert ObjectID to string
	for cursor.Next(context.Background()) {
		var todo models.Todo
		if err := cursor.Decode(&todo); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		todo.ID.Hex() // Convert ObjectID to string
		todos = append(todos, todo)
	}

	// Respond with the list of Todos
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

// GetTodo handles fetching a single Todo by its ID
func GetTodo(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	todoID := params.Get("id")

	var todo models.Todo
	collection := config.Database.Collection("todos")

	// Convert the ID string from the URL to an ObjectID
	objectID, err := primitive.ObjectIDFromHex(todoID)
	if err != nil {
		http.Error(w, "Invalid ObjectID format", http.StatusBadRequest)
		return
	}

	// Fetch the Todo by ID
	err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&todo)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "Todo not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Convert ObjectID to string
	todo.ID.Hex()

	// Respond with the Todo in JSON format
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

// UpdateTodo handles updating an existing Todo
func UpdateTodo(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	todoID := params.Get("id")

	var todo models.Todo
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Convert the ID string from the URL to an ObjectID
	objectID, err := primitive.ObjectIDFromHex(todoID)
	if err != nil {
		http.Error(w, "Invalid ObjectID format", http.StatusBadRequest)
		return
	}

	// Prepare the update data
	collection := config.Database.Collection("todos")
	filter := bson.M{"_id": objectID}
	update := bson.M{
		"$set": bson.M{
			"title":       todo.Title,
			"username": todo.Username,
			"description": todo.Description,
			"done":        todo.Done,
			"deadline": todo.Deadline,
		},
	}

	// Perform the update
	result := collection.FindOneAndUpdate(context.Background(), filter, update)
	if result.Err() != nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	// Respond with the updated Todo
	todo.ID = objectID // Keep the same ID (no conversion needed here)
	todo.ID.Hex()      // Convert to string for response

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

// DeleteTodo handles deleting a Todo
func DeleteTodo(w http.ResponseWriter, r *http.Request) {
	params := r.URL.Query()
	todoID := params.Get("id")

	// Convert the ID string from the URL to an ObjectID
	objectID, err := primitive.ObjectIDFromHex(todoID)
	if err != nil {
		http.Error(w, "Invalid ObjectID format", http.StatusBadRequest)
		return
	}

	// Perform the deletion
	collection := config.Database.Collection("todos")
	result, err := collection.DeleteOne(context.Background(), bson.M{"_id": objectID})
	if err != nil || result.DeletedCount == 0 {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	// Respond with a success message
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(fmt.Sprintf("Todo %s deleted", todoID)))
}
