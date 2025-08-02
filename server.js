const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose')
require('dotenv').config();
const blogRoutes = require('./routes/blogRoutes.js')

app.use(cors());
app.use(express.json());

app.use("/api", blogRoutes);

mongoose.connect(process.env.DB_URI).then(()=>{
    const PORT = 3000;
    app.listen(PORT, ()=>{
        console.log(`Server running on address http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("MongoDB connection error:", err.message);
});
