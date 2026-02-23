import { app, connectDB } from './app';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

