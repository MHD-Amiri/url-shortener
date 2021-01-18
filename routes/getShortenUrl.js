const express = require("express");
const config = require("config");
const Url = require("../models/url");

const getShortenUrlRouter = express.Router();
getShortenUrlRouter.get('/:shortUrl', async (req, res) => {
    var shortUrlCode = req.params.shortUrl;
    var url = await Url.findOne({ urlCode: shortUrlCode });

    try {
        if (url) {
            var clickCount = url.clickCount;
            clickCount++;
            
            console.log(typeof(url.longurl));
            await url.update({ clickCount });
            return res.redirect(url.longUrl);
        } else {
            return res.status(400).json("The short url doesn't exists in our system.");
        }
    }
    catch (err) {
        console.error("Error while retrieving long url for shorturlcode " + shortUrlCode);
        return res.status(500).json("There is some internal error.");
    }
})

module.exports = getShortenUrlRouter;