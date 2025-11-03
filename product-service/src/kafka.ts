// Import necessary modules from kafkajs
import { Kafka, Producer, KafkaConfig, ProducerRecord } from 'kafkajs';

// Kafka client configuration
const kafkaConfig: KafkaConfig = {
  // Use a unique client ID for this service
  clientId: 'product-service', 
  // Point to the Kafka broker defined in docker-compose.yml
  brokers: ['kafka:9092'], 
  // Connection retry settings
  retry: {
      initialRetryTime: 300, 
      retries: 5 
  }
};

// Create a Kafka client instance
const kafka = new Kafka(kafkaConfig);

// Create a producer instance from the client
const producer: Producer = kafka.producer();

// Function to connect the producer
export const connectProducer = async (): Promise<void> => {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected successfully. (Product Service)'); // Log success
  } catch (error) {
    console.error('❌ Failed to connect Kafka Producer (Product Service):', error); // Log error
    // Exit the process if connection fails during startup
    process.exit(1); 
  }
};

// Function to send a message to a specific topic
export const sendMessage = async (topic: string, message: any): Promise<void> => {
    try {
        // Prepare the record to be sent
        const record: ProducerRecord = {
            topic: topic,
            messages: [
                // Stringify the message object to send as JSON
                { value: JSON.stringify(message) } 
            ],
        };
        // Send the record using the producer
        await producer.send(record);
        console.log(`✉️ Message sent to topic ${topic} (Product Service):`, message); // Log sent message
    } catch (error) {
        console.error(`❌ Failed to send message to topic ${topic} (Product Service):`, error); // Log send error
    }
};

// Function to disconnect the producer gracefully (optional, useful for shutdown hooks)
export const disconnectProducer = async (): Promise<void> => {
    try {
        await producer.disconnect();
        console.log('🔌 Kafka Producer disconnected. (Product Service)'); // Log disconnection
    } catch (error) {
        console.error('❌ Failed to disconnect Kafka Producer (Product Service):', error); // Log disconnection error
    }
};

// Note: We are exporting functions (connectProducer, sendMessage) 
// rather than the producer instance itself. This promotes better encapsulation.