const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

// const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config.js");

const app = express();

var corsOptions = {
  // origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cookieSession({
//     name: "cookie-session",
//     secret: "COOKIE_SECRET_YO", // should use as secret environment variable
//     httpOnly: true,
//   })
// );

app.use(express.static("../dist"));

const { Server } = require("socket.io");

const http = require("http");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
  });

  // metaverse
  socket.on("enter-room", (ev) => {
    socket.join(ev.roomID);
  });
  socket.on("leave-room", (ev) => {
    socket.leave(ev.roomID);
  });
  //

  socket.on("chat-message", (ev) => {
    io.to(ev.roomID).emit("chat-message", ev);
    socket.to(ev.roomID).emit("chat-message", ev);
  });

  //
  socket.on("walk-in-room", (ev) => {
    io.to(ev.roomID).emit("walk-in-room", ev);
  });
});

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to microverse application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
