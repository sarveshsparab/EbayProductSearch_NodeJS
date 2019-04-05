var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('sync-request');
var urlencode = require('urlencode');
const querystring = require('querystring');

const apiKey = process.env.EBAY_API_KEY;

function buildEbayUrl(psForm, zipCode) {
    let itemFilterNameCount = 0;

    let tempEbayUrl = 'http://svcs.ebay.com/services/search/FindingService/v1?';
    tempEbayUrl += 'OPERATION-NAME=findItemsAdvanced';
    tempEbayUrl += '&SERVICE-VERSION=1.0.0';
    tempEbayUrl += '&SECURITY-APPNAME=' + apiKey;
    tempEbayUrl += '&RESPONSE-DATA-FORMAT=JSON';
    tempEbayUrl += '&REST-PAYLOAD';
    tempEbayUrl += '&paginationInput.entriesPerPage=50';
    tempEbayUrl += '&keywords=' + encodeURIComponent(psForm.keyword);
    tempEbayUrl += '&buyerPostalCode=' + zipCode;
    if (psForm.category != -1) {
        tempEbayUrl += '&categoryId=' + psForm.category;
    }
    tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').name=MaxDistance';
    tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').value=' + (psForm.miles || '10');
    itemFilterNameCount++;
    if (psForm.freeShipping == true) {
        tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').name=FreeShippingOnly';
        tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').value=true';
        itemFilterNameCount++;
    }
    if (psForm.localPickup == true) {
        tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').name=LocalPickupOnly';
        tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').value=true';
        itemFilterNameCount++;
    }
    tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').name=HideDuplicateItems';
    tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').value=true';
    itemFilterNameCount++;
    if (psForm.condNew == true || psForm.condUsed == true || psForm.condUnspecified == true ){
        tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').name=Condition';
        let itemFilterValueCount = 0;

        if (psForm.condNew == true) {
            tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').value(' + itemFilterValueCount + ')=New';
            itemFilterValueCount++;
        }
        if (psForm.condUsed == true) {
            tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').value(' + itemFilterValueCount + ')=Used';
            itemFilterValueCount++;
        }
        if (psForm.condUnspecified == true) {
            tempEbayUrl += '&itemFilter(' + itemFilterNameCount + ').value(' + itemFilterValueCount + ')=Unspecified';
            itemFilterValueCount++;
        }
        itemFilterNameCount++;
    }
    tempEbayUrl += '&outputSelector(0)=SellerInfo';
    tempEbayUrl += '&outputSelector(1)=StoreInfo';

    return tempEbayUrl;
}

// Primary endpoint to make the external API call and return the captured JSON response
router.get('/:queryParams', function (req, res, next) {
    try {

        console.log('#### ENDPOINT HIT [/ebay/find] ####');

        var queryParams = querystring.parse(req.params.queryParams);
        console.log(queryParams);

        let zipCode = '';
        if (queryParams.zipCodeType === 'cust')
            zipCode = queryParams.custZipCode;
        else
            zipCode = queryParams.currZipCode;

        let url = buildEbayUrl(queryParams, zipCode);

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
