// Next.js Frontend
// File: pages/index.js
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: '',
    name: '',
    contact: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingSummary, setBookingSummary] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkAvailability = async () => {
    const response = await fetch(`/api/bookings?date=${formData.date}&time=${formData.time}`);
    const data = await response.json();
    setAvailableSlots(data.availableSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    setBookingSummary(result);
  };

  return (
    <div>
      <h1>Restaurant Table Booking</h1>
      <form onSubmit={handleSubmit}>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        <input type="number" name="guests" placeholder="Guests" value={formData.guests} onChange={handleChange} required />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
        <button type="button" onClick={checkAvailability}>Check Availability</button>
        <button type="submit">Book Table</button>
      </form>

      {availableSlots.length > 0 && (
        <div>
          <h2>Available Slots</h2>
          <ul>
            {availableSlots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        </div>
      )}

      {bookingSummary && (
        <div>
          <h2>Booking Confirmed</h2>
          <p>{`Date: ${bookingSummary.date}, Time: ${bookingSummary.time}, Guests: ${bookingSummary.guests}`}</p>
          <p>{`Name: ${bookingSummary.name}, Contact: ${bookingSummary.contact}`}</p>
        </div>
      )}
    </div>
  );
}
