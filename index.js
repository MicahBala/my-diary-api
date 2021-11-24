const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const notesRoute = require("./routes/notes");

dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(console.log("Connected to MongoDB!"))
  .catch((err) => console.log("Error: ", err));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api", authRoute);
app.use("/api/users/", usersRoute);
app.use("/api/notes/", notesRoute);
app.use("/", (req, res) => res.status(200).send("Wlecome!"));

const port = 5000;
app.listen(process.env.PORT || port, () => {
  console.log("Backend Running...");
});
