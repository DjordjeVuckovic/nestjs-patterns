
const express = require('express');

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const FAKE_LATENCY_MS = 500;
const FAILURE_RATE = 0.7;
// Save product
app.post('/api/products', async (req, res) => {
  const product = req.body;
  // simulate failing to save product
  await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

  return Math.random() < FAILURE_RATE
    ? res.status(500).json({ message: 'Failed to save product' })
    : res.status(201).json({ message: 'Product saved successfully', product });
})

app.listen(PORT, () => {
  console.log(`🐸 Mock API server is running on http://localhost:${PORT}`);
});
