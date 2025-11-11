import { Kafka, Consumer, EachMessagePayload, Producer, ProducerRecord } from 'kafkajs';
import UserCacheModel from './models/UserCache';
import ProductCacheModel from './models/ProductCache';


const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092'],
  retry: {
      initialRetryTime: 300,
      retries: 5
  }
});

// ----------------  Consumer part ---------------- 
// 1.create consumer instance   2.run handler(subscribe to Topic)  3.handle msg


const consumer: Consumer = kafka.consumer({ groupId: 'order-service-group' });

// 'user.created' messages
const _handleUserCreated = async (messageValue: string | undefined) => {
  if (!messageValue) {
    console.log('Received message with empty value.');
    return;
  }

  const userData = JSON.parse(messageValue);
  console.log('   Message content:', userData);

  if (!userData.id || !userData.email) {
    console.warn('Received message missing id or email:', userData);
    return;
  }

  // 幂等地（Idempotently）更新或插入用户缓存 (执行多次,效果都一样)
  await UserCacheModel.findByIdAndUpdate(
    userData.id, 
    { email: userData.email }, 
    { 
        upsert: true, // "Update or Insert"
        new: true,
        setDefaultsOnInsert: true
    }
  );
  
  console.log(`   ✅ Stored/Updated user cache for ID: ${userData.id}`);
};

// 'product.created' messages
const _handleProductCreated = async (messageValue: string | undefined) => {
  if (!messageValue) {
    console.log('   Received message with empty value.');
    return;
  }

  const productData = JSON.parse(messageValue);
  console.log('   Message content:', productData);

  if (!productData.id || !productData.name || productData.price === undefined || productData.stock === undefined) {
    console.warn('   Received message with incomplete product:', productData);
    return;
  }

  // 幂等地（Idempotently）更新或插入用户缓存
  await ProductCacheModel.findByIdAndUpdate(
    productData.id, // find by id
    { name: productData.name, price: productData.price, stock: productData.stock }, 
    { 
        upsert: true, // "Update if found, Insert if not"
        new: true,
        setDefaultsOnInsert: true
    }
  );
  
  console.log(`   ✅ Stored/Updated product cache for ID: ${productData.id}`);
};

// handle msg with different topics
const _messageHandler = async ({ topic, message }: EachMessagePayload) => {
  console.log(`📥 Received message from topic ${topic}:`);
  const messageValue = message.value?.toString();

  try {
    if (topic === 'user.created') {
      await _handleUserCreated(messageValue);
    } 

    else if (topic === "product.created") {
      await _handleProductCreated(messageValue);
    }

    else {
      console.warn(`   No handler found for topic ${topic}`);
    }

  } catch (error) {
    console.error(`   ❌ Error processing message from topic ${topic}:`, error);
  }
};

// run Kafka consumer
export const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log('✅ Kafka Consumer connected successfully.');

    // subscribe to different topics
    await consumer.subscribe({ 
      topics: ['user.created', 'product.created'], 
      fromBeginning: true 
    });
    console.log('📬 Subscribed to topic: user.created, product.created');

    // run consumer, 将所有消息处理委托给 messageHandler
    await consumer.run({
      eachMessage: _messageHandler,
    });

  } catch (error) {
    console.error('❌ Failed to run Kafka Consumer (startup error):', error);
    process.exit(1); 
  }
};

export const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('🔌 Kafka Consumer disconnected.');
  } catch (error) {
    console.error('❌ Failed to disconnect Kafka Consumer:', error);
  }
};


// ----------------  Producer part ---------------- 
// 1. create and connect instance
// 2. send msg by Topic

const producer: Producer = kafka.producer();

// Saga producer
export const connectProducer = async (): Promise<void> => {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected successfully. (Order Service)'); // Log success
  } catch (error) {
    console.error('❌ Failed to connect Kafka Producer (Order Service):', error); // Log error
    // Exit the process if connection fails during startup
    process.exit(1); 
  }
};

// send saga compensation message
export const sendMessage = async (topic: string, message: any): Promise<void> => {
    try {

        const record: ProducerRecord = {
            topic: topic,
            messages: [{ value: JSON.stringify(message) }],  // Stringify the message object to send as JSON
        };
        // Send the record using the producer
        await producer.send(record);

        console.log(`✉️ Message sent to topic ${topic} (Order Service):`, message); // Log sent message
    } catch (error) {
        console.error(`❌ Failed to send message to topic ${topic} (Order Service):`, error); // Log send error
    }
};

export const disconnectProducer = async (): Promise<void> => {
  try {
    await producer.disconnect();
    console.log('🔌 Kafka Producer disconnected.');
  } catch (err: any) {
    console.error('❌ Failed to disconnect Kafka Consumer:', err.message)
  }
}
