const kafka = require('kafka-node');
const { MongoClient } = require('mongodb');

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'userDatabase';
let db;

// Kafka consumer setup
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new kafka.Consumer(
    client,
    [{ topic: 'user-registration', partition: 0 }],
    { autoCommit: true }
);

// Connect to MongoDB
MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
    .then((client) => {
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    })
    .catch((err) => console.error('MongoDB connection error:', err));

// Process Kafka messages
consumer.on('message', (message) => {
    const user = JSON.parse(message.value);

    db.collection('users')
        .insertOne(user)
        .then(() => console.log(`User ${user.username} inserted into MongoDB`))
        .catch((err) => console.error('Error inserting into MongoDB:', err));
});

consumer.on('error', (err) => {
    console.error('Consumer error:', err);
});
