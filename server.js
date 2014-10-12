var express    = require('express');
var app        = express();
var dataEntry = require('./modules/dataentry');

var router = express.Router();
var routes = require('./routes/index');

// http://localhost:9999/api
app.get('/api', function(req, res) {
    res.send({ message: 'hooray! welcome to our api!' });
});

app.use(express.static(__dirname + '/public'));
// app.set('view engine', 'html');
app.engine('html', require('jade').__express);
app.set('views', __dirname + '/views');

app.all('*', function(req, res, next){
  next();
});

app.get('/api/cord', routes.cord_view);
app.post('/api/cord', routes.cord_add);
app.delete('/api/cord', routes.cord_remove);
app.get('/banner', routes.banner);
app.get('/bannerData', routes.banner_data);
app.get('/bannerUsers', routes.banner_users);

var port = 9000;
app.listen(port);
console.log('Start the server at port :  ' + port);