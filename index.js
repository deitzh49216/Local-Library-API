require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Book model
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number,
    status: String // e.g., 'Available', 'Checked Out'
});
const Book = mongoose.model('Book', bookSchema);

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/books', async (req, res) => {
    const book = new Book(req.body);
    try {
        await book.save();
        res.status(201).send(book);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).send(books);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send();
        }
        res.send(book);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            return res.status(404).send();
        }
        res.send(book);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).send();
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Library API running on http://localhost:${port}`);
});
