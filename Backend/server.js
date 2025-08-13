// File: backend/index.js

const express = require('express');
const path = require('path'); 
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import your route files
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Create the Express app
const app = express();

// --- Middleware ---
// 1. Enable CORS for all requests. This should come early.
app.use(cors());
// 2. Allow the app to parse JSON data.
app.use(express.json());

// --- API Routes ---
// 3. Define your API routes. These must come BEFORE the static file serving.
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/submissions', submissionRoutes); 

// --- Deployment: Static File Serving ---
// This section is for when you deploy your application.
if (process.env.NODE_ENV === 'production') {
    // 4. Serve the static files from the React app's build folder.
    app.use(express.static(path.join(__dirname, '../Frondend/dist')));

    // 5. The "catch-all" route: for any request that doesn't match one above,
    //    send back the React app's index.html file. This must be the LAST route.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../Frondend', 'dist', 'index.html'));
    });
} else {
    // A simple test route for development
    app.get('/', (req, res) => {
        res.send('API is running in development mode...');
    });
}

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT} 🔥`));
