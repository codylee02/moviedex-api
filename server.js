require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const MOVIES = require("./movies-data-small.json");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const bearerToken = req.get("Authorization");
  const apiToken = process.env.API_TOKEN;

  if (!bearerToken || bearerToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unathorized request" });
  }
  next();
});

app.get("/movie", function handleGetMovies(req, res) {
  let response = MOVIES;

  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  if (req.query.avg_vote) {
    response = response.filter(
      movie => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
