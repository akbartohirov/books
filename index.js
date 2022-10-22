const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/userRoute");
const bookRoute = require("./routes/bookRoute");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
app.use(cors());
require("dotenv").config({ path: ".env" });

mongoose.connect(process.env.MONGODB, () => console.log("MongoDB connected"));

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);

app.use("/", express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`The app has been started on port ${PORT}...`);
});
