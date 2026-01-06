const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;
app.use(express.static(path.join(__dirname, 'views')));

// Mongodb connection
mongoose.connect('mongodb://mongo:27017/queue_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// Message schema
const messageSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now },
  consumedAt: Date
});
const Message = mongoose.model('Message', messageSchema);

app.use(express.static(path.join(__dirname, 'views')));

// API to fetch
app.get('/messages', async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
});

app.listen(PORT, () => console.log(`Viewer running at http://localhost:${PORT}`));
