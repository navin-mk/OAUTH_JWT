const http = require("http");
const app = require("./app");
const { initSocket } = require("./socket");

const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT, () =>
  console.log("Server running")
);