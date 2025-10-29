import { Kafka, Producer } from 'kafkajs';

// 创建 Kafka 客户端实例
// 注意：这里的 brokers 指向 docker-compose.yml 中定义的服务名 'kafka'
const kafka = new Kafka({
  clientId: 'user-service', // 客户端 ID，用于日志和监控
  brokers: ['kafka:9092'],   // Kafka Broker 地址列表 (Bootstrap Servers)
  retry: { // 配置连接重试机制
      initialRetryTime: 300, // 初始重试等待时间 (ms)
      retries: 5 // 最大重试次数
  }
});

// 创建生产者实例
const producer: Producer = kafka.producer();

// 连接生产者函数
export const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected successfully.');
  } catch (error) {
    console.error('❌ Failed to connect Kafka Producer:', error);
    // 在实际应用中，连接失败可能需要更健壮的处理，比如退出进程或设置重试
    process.exit(1); // 暂时先简单退出
  }
};

// 发送消息函数 (稍后在路由中使用)
export const sendMessage = async (topic: string, message: any) => {
    try {
        await producer.send({
            topic: topic, // 目标主题
            messages: [
                // Kafka 消息通常包含 key 和 value
                // key 用于分区策略，确保相同 key 的消息进入同一分区 (保证顺序)
                // value 是消息内容，通常是 JSON 字符串
                { value: JSON.stringify(message) }
            ],
        });
        console.log(`✉️ Message sent to topic ${topic}:`, message);
    } catch (error) {
        console.error(`❌ Failed to send message to topic ${topic}:`, error);
    }
};

// (可选) 优雅关闭生产者连接
export const disconnectProducer = async () => {
    try {
        await producer.disconnect();
        console.log('🔌 Kafka Producer disconnected.');
    } catch (error) {
        console.error('❌ Failed to disconnect Kafka Producer:', error);
    }
};

// 导出生产者实例，以便在其他地方使用 (如果需要直接访问)
// 但更推荐使用 sendMessage 函数来封装发送逻辑
// export default producer;