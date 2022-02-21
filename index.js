// imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");

// configure local environment variables
dotenv.config();

// connect to database
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// uploads
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api", routes);

// default route, just for testing
app.get("/", (req, res) => {
  res.send("Welcome to Starfish!");
});

// port
const port = process.env.PORT || 5000;

// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
