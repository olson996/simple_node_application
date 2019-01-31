'use strict';

let express = require('express'),
	app = express(), request = require('request'),
	Twitter = require('twitter'), colorModule = require('./modules/colorSave.js'), cookieParser = require('cookie-parser'),
	expressSession = require('express-session'), passport = require('passport'), Strategy = require('passport-facebook').Strategy;

let client = new Twitter({
	consumer_key: 'auF9yhySNSquYOicJP7YtUuAs',
	consumer_secret: 'NzXUktjzPzqeumqyUwvCPXuSwBaob5MJntftp4eTBW1JDMImZP',
	access_token_key: '1068622170841128960-2noJgNMoNzlYQ9lRu8YIWrvfVcOqHA',
	access_token_secret: 'zvQXwZM0FG7rbZNnRU6s67QVsPa19qU2TgXq0hG71VmxB'
});


app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static('resources'));

app.use(express.json()); // for parsing application/json
app.use(
	express.urlencoded({
		extended: true
	})
); // for parsing application/x-www-form-urlencoded

// Setup session handling
// Always do express-session config first
app.use(
	expressSession({
		secret: 'ihadacatnamedcat',
		resave: false,
		saveUninitialized: false
	})
);

// Configure the Facebook strategy for use by Passport.

passport.use(new Strategy({
	clientID: 2200834233491554,
	clientSecret: '4813606e546ceaded0f5bb88441bad62',
	callbackURL: 'http://localhost:3000/login/facebook/return'
},
function(accessToken, refreshToken, profile, cb) {

	return cb(null, profile);
}));
// Configure Passport authenticated session persistence.

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

app.use(cookieParser());
// Setup Passport
app.use(passport.initialize());
// Make sure express-session was already configured
app.use(passport.session());

app.get('/tweet', function(req, res){
	let data = colorModule.getColor();
	client.post('statuses/update', {status: `${data[0].name} ${data[0].hex}`},  function(error, tweet, response) {
		if(error){
			throw error;
		}
		// console.log(tweet);Tweet body.
		//console.log(response);  Raw response object.
	});
	res.redirect('/landing');
});

app.get('/', function(req, res) { //login page 
	res.render('login');
});

app.get('/login/facebook',
	passport.authenticate('facebook'));

app.get('/login/facebook/return', 
	passport.authenticate('facebook', { failureRedirect: '/' }),
	function(req, res) {
		res.redirect('/landing');
	});

const ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated() === false) {
		console.log('I dont think so!');
		res.sendStatus(403);
		return;
	}
	next();
};


app.get('/landing', ensureAuthenticated, function(req, res){ //home page
	request({
		method: 'GET',
		url: 'https://www.colourlovers.com/api/patterns/random?format=json', //random color request url
		json: true
	}, function(error, response, color){
		color = color[0];
		res.render('index', {
			color
		});
		let colorObj = {
			name: color.title,
			hex: color.colors
		};
		colorModule.addColor(colorObj);
	});
});

app.post('/selection', function(req, res){ //called when a number is submitted in form though ajax post in submit.js
	const paletteChoice = +req.body.color; //body paramater named color
	//console.log(paletteChoice);
	if (Number.isNaN(paletteChoice)) {
		res.sendStatus(400);
		return;
	}
	request(
		{
			method: 'GET',
			url: `https://www.colourlovers.com/api/palette/${paletteChoice}/?format=json`,
			json: true

		},
		function(error, response, color){
			const status = response.statusCode;
			if (status >= 400) {
				res.status(400);
				res.send(`Invalid palette input ${paletteChoice}`);
				return;
			}
			color = color[0];
			//console.log(color);

			res.json(color); //send json object to browser (submit.js)

		}
	);
});

app.get('/documentation', ensureAuthenticated, function(req, res) { //3rd page pretty meaningless
	res.render('documentation');
});

const server = app.listen(3000, function(){
	console.log(`server started on port ${server.address().port}`);
});