require("./backend/server.cjs");

// const express = require("express");
// const app = express();
// const http = require("http");
// const server = http.createServer(app);

//
// const cors = require("cors");

// const port = 3000;

// app.options(
//   cors({
//     origin: true,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE, OPTION",
//     allowedHeaders: ["Access-Control-Allow-Origin"],
//     credentials: true,
//     maxAge: 3600,
//   })
// );

// app.use(express.static("dist"));

// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["my-custom-header"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);
//   socket.on("disconnect", () => {
//     console.log("a user disconnected", socket.id);
//   });

//   // metaverse
//   socket.on("enter-room", (ev) => {
//     socket.join(ev.roomID);
//   });
//   socket.on("leave-room", (ev) => {
//     socket.leave(ev.roomID);
//   });
//   //

//   socket.on("chat-message", (ev) => {
//     io.to(ev.roomID).emit("chat-message", ev);
//     socket.to(ev.roomID).emit("chat-message", ev);
//   });

//   //
//   socket.on("walk-in-room", (ev) => {
//     io.to(ev.roomID).emit("walk-in-room", ev);
//   });
// });

// //

// server.listen(port, () => {
//   console.log("listening on *:3000");
// });
