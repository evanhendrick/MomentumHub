require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000

const mongoUri = process.env.MONGODB_URI
console.log("MONGODB URI", mongoUri)

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected!");
  })
  .catch((err) => {
    console.log(err);
  });

  const allowedOrigins = ["https://momentumhub.onrender.com"]

  const corsOptions = {
    origin: "https://momentumhub.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type"]
  }

  // {
  //   // origin: allowedOrigins
    
  // }

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const mainRoutes = require("./routes/main");

app.use(mainRoutes);

app.listen(PORT, () => {
  console.log("Node.js is listening on port: " + PORT);
});
