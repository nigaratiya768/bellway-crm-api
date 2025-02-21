const connectDatabase = require("./config/database");

const { app } = require("./app");

// const PORT = process.env.PORT || 6001;
const PORT = 4000;
connectDatabase();
app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});

// Handling uncaught error
// process.on('uncaughtException', (err) => {
//   console.error(`Uncaught Exception: ${err.message}`);
//   console.log('Shutting down the server due to uncaught exception');
//   process.exit(1);
// });

// // Unhandled promise rejection
// process.on('unhandledRejection', (err) => {
//   console.error(`Unhandled Rejection: ${err.message}`);
//   console.log('Shutting down the server due to unhandled promise rejection');
//   process.exit(1);
// });
