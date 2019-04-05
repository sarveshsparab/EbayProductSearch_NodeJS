var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('sync-request');
var urlencode = require('urlencode');
const querystring = require('querystring');

const apiKey = process.env.EBAY_API_KEY;

function buildEbayUrl(itemId) {

    let url = 'http://svcs.ebay.com/MerchandisingService?';
    url += 'OPERATION-NAME=getSimilarItems';
    url += '&SERVICE-NAME=MerchandisingService';
    url += '&SERVICE-VERSION=1.1.0';
    url += '&CONSUMER-ID=' + apiKey;
    url += '&RESPONSE-DATA-FORMAT=JSON';
    url += '&REST-PAYLOAD';
    url += '&itemId=' + itemId;
    url += '&maxResults=20';

    return url;
}

// Primary endpoint to make the external API call and return the captured JSON response
router.get('/:queryParams', function (req, res, next) {
    try {

        console.log('#### ENDPOINT HIT [/ebay/similar] ####');

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
