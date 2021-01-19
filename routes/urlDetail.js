const express = require("express");
const authenticate = require("../config/auth");
const Url = require("../models/url");
const getShortenUrlDetailRouter = express.Router();

// GET short URL and redirect to the original URL
getShortenUrlDetailRouter.post("/", authenticate, async (req, res) => {
  let shortUrl = req.body.shortUrl;
  let foundUrl = await Url.findOne({ shortUrl: shortUrl });

  try {
    if (foundUrl) {
      return res.render("pages/urlDetail", {
        title: "Shorten URL Detail",
        userName: req.user.userName,
        clickCount: foundUrl.clickCount,
        longUrl: foundUrl.longUrl,
        shortUrl: foundUrl.shortUrl,
      });
    } else {
      req.flash("error_msg", "The short url doesn't exists in our system");
      return res.redirect("/dashboard");
    }
  } catch (err) {
    req.flash("error_msg", "Error while retrieving detail for shorten URL");
    return res.redirect("/dashboard");
  }
});

module.exports = getShortenUrlDetailRouter;
