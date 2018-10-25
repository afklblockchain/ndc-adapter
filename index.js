var fs = require('fs');
var request = require('request-promise');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var convert = require('xml-js');

var NDC_ADAPTER_LH = function(url, apiKey) {
    var adapter = this;
    adapter.url=url;
    adapter.apiKey = apiKey;

    adapter.AirShopping = function (originLH, destinationLH, dateLH, dateEndLH) {
        return request({
            uri: adapter.url + "catalogues=LH&origin="+originLH+"&destination="+destinationLH+"&travel-date="+dateLH+"&return-date="+dateEndLH+"&cabin-class=economy&travelers=%28adult%3D1%29",
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' +adapter.apiKey,
            }
        }).then(function (body) {
            if (!body){
                console.log("ERROR")
                return;
            }
            console.log("OK")
            return body;
        })
    }

    return adapter;

}

var NDC_ADAPTER_AFKL = function(url, apiKey) {
    var adapter = this;
    adapter.url=url;
    adapter.apiKey = apiKey;


    adapter.AirShopping = function (origin, destination, date) {
        var body = fs.readFileSync("./airshopping.xml").toString()
            .replace('{{destination}}', destination)
            .replace('{{origin}}', origin)
            .replace('{{date}}', date)
        return request({
            uri: adapter.url,
            method: 'POST',
            body: body,
            headers: {
                'api_key': adapter.apiKey,
                'SOAPAction': '"http://www.af-klm.com/services/passenger/ProvideAirShopping/provideAirShopping"',
                'Content-Type': 'text/xml'
            }
        }).then(function (body) {
            if (!body){
                console.log("ERROR")
                return;
            }
            console.log("OK")
            return body;
        })
    }

    return adapter;

}
var NPM = NDC_ADAPTER_AFKL('https://ndc-rct.airfranceklm.com/passenger/distribmgmt/001448v01/EXT?', '3nnfesjhfupgh9dbb42yay55')
NPM.AirShopping('AMS', 'JFK', '2018-11-02').then(function(body) {console.log('done', body)})

var NPM = NDC_ADAPTER_LH('https://api-sandbox.lufthansa.com/v1/offers/fares/allfares?', 'r4r7swg9qfvrjg33kcc3s9kb');
NPM.AirShopping("LHR","FRA","2019-02-01","2019-02-04").then(function (resp){
    var options = {compact: true, ignoreComment: true, spaces: 4};
    var json = JSON.parse(resp);
    var result = convert.json2xml(json, options);
    console.log(result);
});
module.exports = NDC_ADAPTER_AFKL;
module.exports = NDC_ADAPTER_LH;