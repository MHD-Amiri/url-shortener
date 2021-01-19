const express = require("express");
const config = require("config");
const Url = require("../models/url");
const getShortenUrlRouter = express.Router();

// GET short URL and redirect to the original URL
getShortenUrlRouter.get("/:shortUrl", async (req, res) => {
  let shortUrlCode = req.params.shortUrl;
  let url = await Url.findOne({ urlCode: shortUrlCode });

  try {
    if (url) {
      let clickCount = url.clickCount;
      clickCount++;
      await url.update({ clickCount });
      return res.redirect(url.longUrl);
    } else {
      return res
        .status(400)
        .json("The short url doesn't exists in our system.");
    }
  } catch (err) {
    console.error(
      "Error while retrieving long url for shorturlcode: " + shortUrlCode
    );
    return res.status(500).json("There is some internal error.");
  }
});

module.exports = getShortenUrlRouter;
