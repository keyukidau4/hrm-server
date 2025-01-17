// Import the 'express' module
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import Router from './routes';
import { connectDB } from './config/database';

// Create an Express application
const app = express();

// Set the port number for the server
const port = 8080;

//call enviroment

connectDB();

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api', Router);

// Define a route for the root path ('/')
app.get('/', (req, res) => {
    // Send a response to the client
    res.send('Hello');
});

// Start the server and listen on the specified port
app.listen(port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${port}`);
});
