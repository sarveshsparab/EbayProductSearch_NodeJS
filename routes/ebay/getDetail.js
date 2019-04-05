var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('sync-request');
var urlencode = require('urlencode');
const querystring = require('querystring');

const apiKey = process.env.EBAY_API_KEY;

function buildEbayUrl(itemId) {

    let url = 'http://open.api.ebay.com/shopping?';
    url += 'callname=GetSingleItem';
    url += '&responseencoding=JSON';
    url += '&appid=' + apiKey;
    url += '&siteid=0';
    url += '&version=967';
    url += '&ItemID=' + itemId;
    url += '&IncludeSelector=Description,Details,ItemSpecifics';

    return url;
}

// Primary endpoint to make the external API call and return the captured JSON response
router.get('/:queryParams', function (req, res, next) {
    try {

        console.log('#### ENDPOINT HIT [/ebay/detail] ####');

        var queryParams = querystring.parse(req.params.queryParams);
        console.log(queryParams);

        let url = buildEbayUrl(queryParams.itemid);

        console.log('URL formed: ' + url);
        data = request("GET", url);

        response = JSON.parse(data.getBody().toString('utf8'));
        res.send(response);
    } catch (e) {
        console.log(e);
        res.status(400).send("Error");
    }
});

// A dummy endpoint to simulate failure with code
router.get('/fail/:code', function (req, res, next) {
    res.status(req.params.code).send("Error Forced!");
});

module.exports = router;
