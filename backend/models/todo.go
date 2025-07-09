package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Todo struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username    string             `json:"username" bson:"username"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	Done        bool               `json:"done"`
	Deadline    string             `json:"deadline"`
}
