const express = require("express");
// const helmet = require("helmet");

const app = express();
const port = 3000;

// app.use(helmet());
app.use(express.static("dist"));

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
