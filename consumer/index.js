const Redis = require('ioredis');
const mongoose = require('mongoose');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379
});

// MongoDB setup
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/queue_db')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

const messageSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

async function consume() {
  while (true) {
    const msg = await redis.rpop('messages');
    if (msg) {
      console.log("Consumed:", msg);
      // Could update MongoDB if needed
      await Message.updateOne({ content: msg }, { consumedAt: new Date() });
    } else {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

consume();
