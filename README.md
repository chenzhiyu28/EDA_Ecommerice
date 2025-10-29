EDA E-commerce MVP Demo
🚀 Project Goal
This project aims to build a Minimum Viable Product (MVP) demonstration of an e-commerce system based on Event-Driven Architecture (EDA). The primary purpose is to learn and practice the application of the following technology stack in a microservices environment:

TypeScript

Node.js & Express

MongoDB & Mongoose

Apache Kafka (using Kraft mode) & KafkaJS

Docker & Docker Compose

(Future Plan) API Gateway

(Future Plan) React Frontend

The focus is on establishing asynchronous communication flows between services and understanding the decoupling and resilience advantages offered by the EDA pattern, rather than pursuing perfection in any specific business functionality.

🏗️ Architecture Overview
The system adopts a microservices architecture where services communicate via events through Kafka.

Services:

user-service: (Basic CRUD & Event Publishing Implemented) Manages user registration and queries.

order-service: (Basic CRUD & Event Consumption Implemented) Manages order creation and queries.

product-service: (Planned) Manages product information (name, price, inventory).

api-gateway: (Planned) A unified API entry point handling external request routing.

Messaging Middleware:

kafka: (Integrated) Serves as the event bus, handling asynchronous message passing between services.

Databases:

MongoDB: Each service has its own independent MongoDB database instance.

Containerization:

Docker & Docker Compose: Used to build, run, and manage all services and infrastructure.
