const express = require('express');
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const auditRoutes = require('./routes/auditRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// CORS: allow only the deployed frontend (set FRONTEND_URL on Render).
// Falls back to localhost for local development.
// This configuration tells the backend to accept ANY origin
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/teachers', teacherRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running... 🔥');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT} 🔥`)
);

