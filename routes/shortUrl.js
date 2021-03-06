const express = require("express");
const authenticate = require("../config/auth");
var { nanoid } = require("nanoid");
const validUrl = require("valid-url");
const config = require("config");
const shortUrlRouter = express.Router();

// User model
const Url = require("../models/url");

// POST handler for URL shortener
shortUrlRouter.post("/", authenticate, async (req, res) => {
  // get data from request
  let longUrl = req.body.url;
  const suggestion = req.body.suggestion;
  // get base URL from default.json
  const baseUrl = config.get("baseURL");
  // check whether the base URL is valid or not
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Internal error. Please come back later.");
  }
  // generate a code for long URL
  const urlCode = nanoid();

  if (validUrl.isUri(longUrl)) {
    try {
      // check if there is a short URL for this long version or not, if there is one return it
      let foundUrl = await Url.findOne({ longUrl: longUrl });
      if (foundUrl) {
        return res.render("pages/generatedUrl", {
          title: "Generated URL",
          longUrl: foundUrl.longUrl,
          urlCode: foundUrl.urlCode,
          shortUrl: foundUrl.shortUrl,
        });
      } else {
        // if the long URL is new save it and return the result
        const shortUrl = baseUrl + "/urlgen/" + urlCode;
        newUrl = new Url({
          longUrl,
          shortUrl,
          urlCode,
          clickCount: 0,
        });

        await newUrl.save();
        return res.render("pages/generatedUrl", {
          title: "Generated URL",
          longUrl: newUrl.longUrl,
          urlCode: newUrl.urlCode,
          shortUrl: newUrl.shortUrl,
        });
      }
      // catch server errors
    } catch (err) {
      console.error(err.message);
      return res.status(500).json("Internal Server error " + err.message);
    }
    // catch invalid URL
  } else {
    res
      .status(400)
      .json("Invalid URL. Please enter a valid url for shortening.");
  }
});

module.exports = shortUrlRouter;
