from confluent_kafka import Consumer

# Configure the consumer
conf = {
    'bootstrap.servers': "localhost:9092",  
    'group.id': "mygroup",                 
    'auto.offset.reset': 'earliest'        
}
consumer = Consumer(conf)

# Subscribe to the topic
consumer.subscribe(['test'])

# Poll for messages
try:
    while True:
        msg = consumer.poll(1.0)  
        if msg is None:
            continue
        if msg.error():
            print(f"Consumer error: {msg.error()}")
            continue
        print(f"Received message: {msg.value().decode('utf-8')}")  
except KeyboardInterrupt:
    print("Consumer stopped.")
finally:
    # Close the consumer
    consumer.close()
