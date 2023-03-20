const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  },
});

const cors = require("cors");

const port = 3000;

app.options(
  cors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTION",
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
    maxAge: 3600,
  })
);

// src

app.get("/", (req, res) => {
  res.json({ yo: true });
});

//
let rooms = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("enter", () => {
    //
  });
  socket.on("walk", (ev) => {
    io.emit("walk", ev);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log("listening on *:3000");
});
