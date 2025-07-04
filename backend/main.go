package main

import (
	"backend/config"
	"backend/routes"
	"fmt"
	"log"
	"net/http"
)

func main() {
	config.ConnectDB()
	defer config.CloseDB()

	router := routes.SetupRoutes()

	fmt.Println("Server is running on port 8000")
	if err := http.ListenAndServe(":8000", router); err != nil {
		log.Fatal(err)
	}
}
