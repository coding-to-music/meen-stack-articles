const env = require("dotenv");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const fetch = require("node-fetch");

const Article = require("../models/article");
const githubUrl = "https://api.github.com/users/AndrewJBateman";
const maxTitleLength = 40;
const maxSummaryLength = 400;
const maxMarkdownLength = 2000;

// Display articles list in date order
exports.article_list = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: "desc" });
    const totalArticles = articles.length;
    const articlesString = articles.length === 1 ? " article" : " articles";
    res.status(200).render("articles/index", {
      articles,
      totalArticles,
      articlesString,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Display new article
exports.new_article = async (req, res) => {
  try {
    // const maxTitleLength = 80;
    // const maxSummaryLength = 400;
    // const maxMarkdownLength = 2000;
    res.status(200).render("articles/new", {
      article: new Article(),
      maxTitleLength,
      maxMarkdownLength,
      maxSummaryLength,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Find article to edit
exports.find_to_edit = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    let maxTitleLength = 40;

    res.status(200).render("articles/edit", {
      article: article,
      maxTitleLength,
      maxMarkdownLength,
      maxSummaryLength,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Find article to display
exports.find_to_show = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    let dateNow = dayjs();
    let articleDate = article.createdAt;
    let articleTimeAgo = dateNow.from(articleDate, true);
    if (article == null) res.redirect("/");
    res
      .status(200)
      .render("articles/display_all", { article: article, articleTimeAgo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Presave new article
exports.presave_new_article = async (req, res, next) => {
  try {
    req.article = new Article();
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Presave edited article
exports.presave_edited_article = async (req, res, next) => {
  try {
    req.article = await Article.findById(req.params.id);
    res.status(200);
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete article
exports.delete_article = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fetch Github profile info to show in Contact page
exports.fetch_github_profile = async (req, res) => {
  try {
    const response = await fetch(githubUrl);
    const user = await response.json();
    res.status(200).render("articles/contact", { user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
