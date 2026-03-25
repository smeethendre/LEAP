import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/login", (req, res) => {
  res
    .setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
    .send("Welcome back, Smeet");
});

export { app };
