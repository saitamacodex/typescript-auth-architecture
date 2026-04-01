import http from "node:http";
import { createExppressApp } from "./app/app.js";

async function main() {
  try {
    const PORT: number = 9090;
    const server = http.createServer(createExppressApp());

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.log("Error while starting server.");
    throw error;
  }
}

main();
