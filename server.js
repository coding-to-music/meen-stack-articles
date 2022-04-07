// dotenv config
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");

const app = express();
// const { PORT, mongoUri } = require("./config/config");
const path = require("path");
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

const article_controller = require("./controllers/article.controllers");

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", article_controller.article_list);
app.use("/articles", articleRouter);
app.use(express.static(path.join(__dirname, "public")));

// app.listen(PORT, () => {
//   console.log("Server is running on Port:", PORT);
// });

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
