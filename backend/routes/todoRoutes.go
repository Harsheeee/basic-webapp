package routes

import (
	"backend/controllers"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func SetupRoutes() http.Handler {
	router := mux.NewRouter()

	// Define your routes here
	router.HandleFunc("/create", controllers.CreateTodo).Methods("POST")
	router.HandleFunc("/todos", controllers.GetTodos).Methods("GET")
	router.HandleFunc("/todo", controllers.GetTodo).Methods("GET")
	router.HandleFunc("/update", controllers.UpdateTodo).Methods("PUT")
	router.HandleFunc("/delete", controllers.DeleteTodo).Methods("DELETE")

	router.HandleFunc("/register", controllers.CreateUser).Methods("POST")
	router.HandleFunc("/login", controllers.AuthenticateUser).Methods("POST")

	cors := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	return cors(router)
}
