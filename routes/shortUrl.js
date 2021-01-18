const express = require("express");
const shortid = require("shortid");
const validUrl = require("valid-url");
const config = require("config");
const Url = require("../models/url");

const shortUrlRouter = express.Router();

shortUrlRouter.post("/", async (req, res) => {
  let longUrl = req.body.url;
  const suggestion = req.body.suggestion;
  const baseUrl = config.get("baseURL");
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Internal error. Please come back later.");
  }

  const urlCode = shortid.generate();

  if (validUrl.isUri(longUrl)) {
    try {
      var url = await Url.findOne({ longUrl: longUrl });
      if (url) {
        return res.status(200).json(url);
      } else {
        const shortUrl = baseUrl + "/urlgen/" + urlCode;
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          clickCount: 0,
        });

        await url.save();
        return res.status(201).json(url);
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).json("Internal Server error " + err.message);
    }
  } else {
    res
      .status(400)
      .json("Invalid URL. Please enter a valid url for shortening.");
  }
});

module.exports = shortUrlRouter;
