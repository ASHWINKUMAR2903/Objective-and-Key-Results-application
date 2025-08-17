const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require('./routes/auth');
const verifyToken = require('./middleware/authMiddleware');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("MyOKR backend is running!");
});
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.name}! This is protected data.` ,
    name: req.user.name,
    role: req.user.role
  });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));