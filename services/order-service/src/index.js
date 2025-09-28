import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4003
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/order_service'

const cartItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  imageUrl: String
}, { _id: false })

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [cartItemSchema],
  total: Number,
  status: { type: String, default: 'pending' }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

app.post('/api/cart/checkout', async (req, res) => {
  try {
    const { userId, items } = req.body
    const total = (items || []).reduce((s, it) => s + (it.price * it.quantity), 0)
    const order = await Order.create({ userId, items, total, status: 'paid' })
    res.status(201).json(order)
  } catch (e) {
    res.status(400).json({ message: 'Invalid payload' })
  }
})

app.get('/api/orders/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
  res.json(orders)
})

app.get('/health', (req, res) => res.json({ ok: true }))

async function start() {
  await mongoose.connect(MONGO_URI)
  app.listen(PORT, () => console.log(`order-service listening on ${PORT}`))
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})


