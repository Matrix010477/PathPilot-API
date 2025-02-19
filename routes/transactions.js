const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tf = require('@tensorflow/tfjs');
const path = require('path');

// Load a pre-trained model (replace with your model's path)
let model;
async function loadModel() {
    try {
        model = await tf.loadLayersModel('file://./path_to_your_model/model.json'); // Adjust this path to the actual model location
        console.log('Model loaded successfully!');
    } catch (err) {
        console.error('Error loading model: ', err);
    }
}

loadModel(); // Load the model when the app starts

const app = express();
app.use(bodyParser.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Atlas Connected');
    })
    .catch(err => {
        console.log('MongoDB Connection Error: ', err);
    });

// Simple GET route to check API
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working!" });
});

// Add a POST endpoint for career prediction
app.post('/api/submitCareerData', async (req, res) => {
    if (!model) {
        return res.status(500).json({ message: 'Model is not loaded yet!' });
    }

    const inputData = req.body.inputData; // assuming inputData contains the career-related data

    if (!inputData) {
        return res.status(400).json({ message: 'Input data is missing!' });
    }

    try {
        const prediction = model.predict(tf.tensor([inputData])); // Adjust according to your model's expected input
        const careerPrediction = prediction.dataSync()[0];
        res.status(200).json({
            message: 'Career data received!',
            inputData,
            predictedCareer: careerPrediction,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error in prediction!' });
    }
});

// Serve static files if you have front-end assets (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server on port 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
