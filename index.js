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

app.use("/", (req, res) => res.status(200).send("Wlecome!"));
app.use("/api", authRoute);
app.use("/api/users/", usersRoute);
app.use("/api/notes/", notesRoute);

const port = 5000;
app.listen(process.env.PORT || port, () => {
  console.log("Backend Running...");
});
