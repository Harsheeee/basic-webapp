package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var Database *mongo.Database

const dbName = "todos"

func ConnectDB() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading env")
	}
	mongoURI := os.Getenv("MONGO_URI")

	Client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}

	err = Client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	Database = Client.Database(dbName)
	fmt.Println("Connected to MongoDB!")
}

func CloseDB() {
	if err := client.Disconnect(context.Background()); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connection to MongoDB closed.")
}
