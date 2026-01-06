const Redis = require('ioredis');
const mongoose = require('mongoose');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379
});

// Mongodb setup
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo.dist-lab.svc.cluster.local:27017/queue_db')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

const messageSchema = new mongoose.Schema({
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// every 3 seconds
setInterval(async () => {
  const msg = `Hello ${Date.now()}`;
  await redis.lpush('messages', msg);
  console.log("Produced:", msg);

  // save in Mongodb
  const dbMsg = new Message({ content: msg });
  await dbMsg.save();
}, 3000);
