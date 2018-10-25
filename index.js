var fs = require('fs');
var request = require('request-promise');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
const path = require("path");


var NDC_ADAPTER = function(url, apiKey) {
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
                'SOAPAction': '"http://www.af-klm.com/services/passenger/ProvideAirShopping/provideAirShopping"',
                'Content-Type': 'text/xml'
            }
        }).then(function (body) {
            if (!body){
                console.log("ERROR")
                return;
            }
            return body;
        })
    }

    return adapter;

}

module.exports = NDC_ADAPTER;