// Backend - Node.js/Express
// File: server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://medebu2021:rA05cmIVx85P3a1S@cluster0.70fxw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI
const client = new MongoClient(uri);
let bookingsCollection;

// Connect to MongoDB
client.connect()
  .then(() => {
    const db = client.db("restaurantBookingDB");
    bookingsCollection = db.collection("bookings");
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Get bookings (check availability)
app.get('/api/bookings', async (req, res) => {
  const { date, time } = req.query;
  try {
    const existingBookings = await bookingsCollection.find({ date, time }).toArray();
    const availableSlots = existingBookings.length ? [] : ['12:00 PM', '1:00 PM', '2:00 PM']; // Example slots
    res.json({ availableSlots });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Create a booking
app.post('/api/bookings', async (req, res) => {
  const { date, time, guests, name, contact } = req.body;
  try {
    const isSlotTaken = await bookingsCollection.findOne({ date, time });
    if (isSlotTaken) {
      return res.status(400).json({ error: 'Slot already booked' });
    }

    const booking = { date, time, guests, name, contact };
    await bookingsCollection.insertOne(booking);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
