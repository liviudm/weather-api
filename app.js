var express = require('express');
var app = express();
var geoip = require('geoip-lite');
var Forecast = require('forecast');

app.set('port', (process.env.PORT || 5000));
app.set('forecastApiKey', process.env.FORECAST_API_KEY);

function getCoordinates(ip) {
  return geoip.lookup(ip).ll;
}

var forecast = new Forecast({
  service: 'forecast.io',
  key: app.get('forecastApiKey'),
  units: 'cecius',
  cache: true,
  ttl: {
    minutes: 30,
    seconds: 45
  }
});

app.get('/', function(req, res) {
  var ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress;
  forecast.get(getCoordinates(ip), function(err, weather) {
    if(err) res.status(500).json({ error: 'Can\'t get weather data'});
    res.status(200).json({ status: 200, timezone: weather.timezone, currently: weather.currently});
  });
});

app.listen(app.get('port'), function() {
  console.log('Weather Bot listening on port ', app.get('port'));
});
