const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const category = require('./routes/CategoryRoutes');
const product = require('./routes/ProductRoutes');
const user = require('./routes/UserRoute');
const ticket = require('./routes/TicketRoutes');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials:true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));

app.use('/category' , category);
app.use('/product', product);
app.use('/user' , user);
app.use('/ticket' , ticket);
app.listen(PORT , async ()=>{
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log('Error connecting to database', error.message);
    }
});

