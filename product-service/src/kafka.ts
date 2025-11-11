import { Kafka, Producer, KafkaConfig, ProducerRecord, Consumer, EachMessagePayload } from 'kafkajs';
import ProductModel from './models/Product';


const kafkaConfig: KafkaConfig = {

  clientId: 'product-service', 
  brokers: ['kafka:9092'], 
  retry: {
      initialRetryTime: 300, 
      retries: 5 
  }
};

const kafka = new Kafka(kafkaConfig);

// ----------------  Producer part ---------------- 
// 1. create and connect instance
// 2. send msg by Topic

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


// ----------------  Consumer part ---------------- 
// 1.create consumer instance   2.run handler(subscribe to Topic)  3.handle msg
const consumer: Consumer = kafka.consumer({groupId: "product-service-group"});

// handle order create
async function _messageHandler({topic, message}: EachMessagePayload) {
    console.log(`📥 Received message from topic ${topic}:`);
    const messageValue = message.value?.toString();

    if (!messageValue) {    
        console.log('Received message with empty value.');
        return;
    }

    const userData = JSON.parse(messageValue);
    console.log('Message content:', userData);

    if (!userData.productID || !userData.quantity) {
        console.warn('Received message missing product or quantity:', userData);
        return;
    }

    await ProductModel.findByIdAndUpdate(
        userData.productID, 
        {$inc: { stock: -userData.quantity }} // $inc 会在原值基础上 减去 quantity
    );

    
    console.log(`✅ Updated Product quantity for ID: ${userData.productID}`);
}

export const runConsumer = async () => {
    try {
      await consumer.connect();
      console.log('✅ Kafka Consumer connected successfully.');

      // subscribe
      await consumer.subscribe({
        topic: "order.created",
        fromBeginning: true,
      })
      console.log('📬 Subscribed to topic: order.created');

      // handle msg
      await consumer.run({
        eachMessage: _messageHandler,
      });
    } catch (err: any) {
      console.error('❌ Failed to run Kafka Consumer (startup error):', err.message);
      process.exit(1); 
    }
}

export const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('🔌 Kafka Consumer disconnected.');
  } catch (error) {
    console.error('❌ Failed to disconnect Kafka Consumer:', error);
  }
};