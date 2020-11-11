
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 3000;
const playUrl = 'https://play.google.com/store/apps/details?id='
const userAgent = 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Mobile Safari/537.36'
app.get('/:packageName', (req,res) => {
	request({url: playUrl + req.params.packageName, headers: {'User-Agent': userAgent}}, (e, r, body) => {
		const $ = cheerio.load(body)
		const version = $('.htlgb').eq(6).children().first().text()
		const responseObject = {
			bundleId: req.params.packageName,
			version: version === 'Varies with device' ? '0.0.0' : version
		}
		res.send(responseObject)
	})
});

app.listen(port, () => console.log('Listening on :' + port));
