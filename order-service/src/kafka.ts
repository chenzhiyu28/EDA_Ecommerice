import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import UserCacheModel from './models/UserCache';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092'],
  retry: {
      initialRetryTime: 300,
      retries: 5
  }
});

const consumer: Consumer = kafka.consumer({ groupId: 'order-service-group' });

/**
 * 处理 'user.created' 主题的消息
 * 使用 upsert 幂等地将用户数据缓存到 order-db
 */
const handleUserCreated = async (messageValue: string | undefined) => {
  if (!messageValue) {
    console.log('   Received message with empty value.');
    return;
  }

  const userData = JSON.parse(messageValue);
  console.log('   Message content:', userData);

  if (!userData.id || !userData.email) {
    console.warn('   Received message missing id or email:', userData);
    return;
  }

  // 幂等地（Idempotently）更新或插入用户缓存
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


/**
 * 消息处理器 "路由器"
 * 根据 topic 将消息分发给正确的处理函数
 */
const messageHandler = async ({ topic, message }: EachMessagePayload) => {
  console.log(`📥 Received message from topic ${topic}:`);
  const messageValue = message.value?.toString();

  try {
    if (topic === 'user.created') {
      await handleUserCreated(messageValue);
    
    // } else if (topic === 'product.created') {
      // Sprint 2 将在这里添加
      // await handleProductCreated(messageValue);
    
    } else {
      console.warn(`   No handler found for topic ${topic}`);
    }

  } catch (error) {
    console.error(`   ❌ Error processing message from topic ${topic}:`, error);
  }
};


/**
 * run Kafka consumer
 */
export const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log('✅ Kafka Consumer connected successfully.');

    // 订阅主题 (未来可以订阅多个)
    await consumer.subscribe({ topic: 'user.created', fromBeginning: true });
    console.log('📬 Subscribed to topic: user.created');

    // run consumer, 将所有消息处理委托给 messageHandler
    await consumer.run({
      eachMessage: messageHandler,
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