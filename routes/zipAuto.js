var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('sync-request');
var urlencode = require('urlencode');
const querystring = require('querystring');

const apiKey = process.env.GEO_NAMES_USER_NAME;

function buildGeoNamesURL(zipStart) {
    let url = 'http://api.geonames.org/postalCodeSearchJSON?';
    url += 'postalcode_startsWith=' + zipStart;
    url += '&username=' + apiKey;
    url += '&country=US';
    url += '&maxRows=5';

    return url;
}

// Primary endpoint to make the external API call and return the captured JSON response
router.get('/:queryParams', function (req, res, next) {
    try {

        console.log('#### ENDPOINT HIT [/zipAuto] ####');

        var queryParams = querystring.parse(req.params.queryParams);
        console.log(queryParams);

        let url = buildGeoNamesURL(queryParams.startZip);

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
