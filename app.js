'use strict';

var express = require('express');
var path = require('path');
var Database = require('./lib/database');
var assert = require('assert');

// Constants

// Routes
var highscores = require('./routes/highscores');
var user = require('./routes/user');
var loc = require('./routes/location');

// App
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Handle root web server's public directory
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/highscores', highscores);
app.use('/user', user);
app.use('/location', loc);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handler
app.use(function(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Health Check

// app.js: register the route. In our case, we don't want authorization for this route
app.use('/healthcheck', require('./routes/healthcheck.routes'));

const router = express.Router({});
router.get('/', async (_req, res, _next) => {
	// optional: add further things to check (e.g. connecting to dababase)
	const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(503).send();
	}
});
// export router with all routes included
module.exports = router;

// healthcheck.spec.js (services like Pingdom or Freshping do a similar approach to check whether your server is healthy)
describe('Healthcheck', () => {

	it('returns 200 if server is healthy', async () => {
		const res = await get(`/healthcheck`, null)
			.expect(200);
		expect(res.body.uptime).toBeGreaterThan(0);
	});

});

Database.connect(app, function(err) {
    if (err) {
        console.log('Failed to connect to database server');
    } else {
        console.log('Connected to database server successfully');
    }

});

module.exports = app;
