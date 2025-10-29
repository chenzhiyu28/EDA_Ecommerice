import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

// Kafka 客户端实例 (与生产者类似)
const kafka = new Kafka({
  clientId: 'order-service', // 客户端 ID
  brokers: ['kafka:9092'],   // Kafka Broker 地址
  retry: {
      initialRetryTime: 300,
      retries: 5
  }
});

// 创建消费者实例
// !! 重要：指定一个消费者组 ID !!
const consumer: Consumer = kafka.consumer({ groupId: 'order-service-group' });

// 运行消费者函数
export const runConsumer = async () => {
  try {
    // 1. 连接消费者
    await consumer.connect();
    console.log('✅ Kafka Consumer connected successfully.');

    // 2. 订阅主题
    await consumer.subscribe({ topic: 'user.created', fromBeginning: true });
    // fromBeginning: true 表示如果这个组是第一次启动，会从主题的最开始消费消息
    // 否则会从上次消费的位置继续。对于我们的场景，true 比较方便测试。
    console.log('📬 Subscribed to topic: user.created');

    // 3. 运行消费者循环来处理消息
    await consumer.run({
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        // 当收到消息时，这个函数会被调用
        console.log(`📥 Received message from topic ${topic}:`);

        // message.value 通常是 Buffer，需要转换成字符串
        const messageValue = message.value?.toString(); 

        if (messageValue) {
            try {
                const userData = JSON.parse(messageValue);
                console.log('   Message content:', userData);

                // --- 未来在这里添加处理逻辑 ---
                // 例如：将用户信息存储到 order-service 自己的数据库
                // const { id, email } = userData;
                // await saveOrUpdateUserCache(id, email); 
                // -----------------------------

            } catch (parseError) {
                console.error('   Error parsing message JSON:', parseError);
            }
        } else {
            console.log('   Received message with empty value.');
        }
      },
    });

  } catch (error) {
    console.error('❌ Failed to run Kafka Consumer:', error);
    process.exit(1); // 连接或订阅失败则退出
  }
};

// (可选) 优雅关闭消费者连接
export const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    console.log('🔌 Kafka Consumer disconnected.');
  } catch (error) {
    console.error('❌ Failed to disconnect Kafka Consumer:', error);
  }
};