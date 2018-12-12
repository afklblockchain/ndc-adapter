var fs = require('fs');
var request = require('request-promise');
var convert = require('xml-js');
const path = require("path");

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
        var body = fs.readFileSync(path.resolve(__dirname, "airshopping.xml")).toString()
            .replace('{{destination}}', destination)
            .replace('{{origin}}', origin)
            .replace('{{date}}', date)
        return request({
            uri: adapter.url,
            method: 'POST',
            body: body,
            headers: {
                'api_key': adapter.apiKey,
                'SOAPAction': '{af-soap-action}',
                'Content-Type': 'text/xml'
            }
        }).then(function (body) {
            if (!body){
                console.log("ERROR")
                return;
            }
            // console.log(body)
            return body;
        })
    }

    return adapter;

}

var NPM = NDC_ADAPTER_LH({lh-url}, {api-token});
NPM.AirShopping("LHR","FRA","2019-02-01","2019-02-04").then(function (resp){
    var options = {compact: true, ignoreComment: true, spaces: 4};
    var json = JSON.parse(resp);
    var result = convert.json2xml(json, options);
    console.log(result);
});
module.exports = NDC_ADAPTER_AFKL;
module.exports = NDC_ADAPTER_LH;
