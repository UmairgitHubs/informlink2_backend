import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import OurRouter from "./route/route.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.port || 3000;
const connectionUrl = process.env.ConnectionUrl;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

mongoose
  .connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) =>
    console.log("Getting Error from DB connection" + err.message)
  );

app.get("/", (req, res) => {
  console.log("Home URL /");
  res.send("Server is running at localhost 8000 !");
});
app.use("/api", OurRouter);

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`);
});
