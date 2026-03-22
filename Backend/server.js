// load environment variables before other modules so they are available
// during initialization (especially in services like mail.service)
import "dotenv/config.js";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.BACKEND_PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB().catch((err) => {
  console.error(`Error connecting to the database: ${err}`);
  process.exit(1);
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.BACKEND_PORT}`);
});
