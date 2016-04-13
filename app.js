var express = require('express');
var app = express();
var geoip = require('geoip-lite');
var Forecast = require('forecast');

function getCoordinates(ip) {
  return geoip.lookup(ip).ll;
}

var forecast = new Forecast({
  service: 'forecast.io',
  key: '78c2cde5f16958973830ec2aa6037442',
  units: 'cecius',
  cache: true,
  ttl: {
    minutes: 30,
    seconds: 45
  }
});

app.get('/', function(req, res) {
  var ip = req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
  forecast.get(getCoordinates(ip), function(err, weather) {
    if(err) res.status(500).json({ error: 'Can\'t get weather data'});
    res.json(weather);
  });
});

app.listen(3000, function() {
  console.log('Weather Bot listening on port 3000');
});
