var fs = require('fs');
var request = require('request-promise');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();


var NDC_ADAPTER = function(url, apiKey) {
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
            // console.log(body)
            return body;
        })
    }

    return adapter;

}
var NPM = NDC_ADAPTER('https://ndc-rct.airfranceklm.com/passenger/distribmgmt/001448v01/EXT?', '3nnfesjhfupgh9dbb42yay55')
NPM.AirShopping('AMS', 'JFK', '2018-11-02').then(function(body) {console.log('done', body)})

module.exports = NDC_ADAPTER;