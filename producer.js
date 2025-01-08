const express = require('express');
const bodyParser = require('body-parser');
const kafka = require('kafka-node');

const app = express();
const PORT = 3000;

// Kafka setup
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
    console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (err) => {
    console.error('Kafka Producer error:', err);
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// API endpoint for registration
app.post('/api/register', (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).send('Invalid input');
    }

    const payloads = [
        { topic: 'user-registration', messages: JSON.stringify({ username, email }) },
    ];

    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending to Kafka:', err);
            return res.status(500).send('Registration failed');
        }
        res.status(200).send('Registration successful');
    });
});

// Route for the root path (GET /)
app.get('/', (req, res) => {
    res.send('Welcome to the Kafka Producer API!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
