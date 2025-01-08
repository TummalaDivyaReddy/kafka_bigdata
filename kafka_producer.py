from confluent_kafka import Producer

# Configure the producer
conf = {'bootstrap.servers': "localhost:9092"}  # Kafka broker address
producer = Producer(**conf)

# Delivery report callback to confirm message delivery
def delivery_report(err, msg):
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")

# Produce a message to 'test-topic'
producer.produce('test', key="key", value="Hello, Kafka!", callback=delivery_report)

# Wait for all messages to be delivered
producer.flush()
