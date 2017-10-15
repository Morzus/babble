var express = require('express');
var app = express();

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));

var vegansMsgClass = require('./messages-util.js')
app.set('vegansMsgApp', vegansMsgClass);
app.get('/messages', getHandler);
app.post('/messages', postHandler);
app.delete('/messages/:id', deleteHandler);
app.all('/messages', handleMethodNotAllowed);
app.get('/stats', getConnectionStatisticsHandler);
app.all('/stats', handleMethodNotAllowed);

function getHandler(req, res, next) {
    if (isValid(req))
    {
        if (req.app.get('vegansMsgApp').getNewMsgs(req.query.counter)) {
            res.json(req.app.get('vegansMsgApp').getMessages(req.query.counter)).send().end();
        } else {
            req.app.get('vegansMsgApp').AddClientToLogPollingWait(req.query.counter, res);
        }
    } else {
        res.status(400).send().end();
    }
    };

function postHandler(req, res, next) {
    var response = req.app.get('vegansMsgApp').addMessage(req.body);
    req.app.get('vegansMsgApp').RemoveClientFromLongPollingWait();
    res.json(response).send().end();
};

function deleteHandler(req, res, next) {
    req.app.get('vegansMsgApp').deleteMessage(req.params.id);
res.status(200).send().end();
};

function getConnectionStatisticsHandler (req, res, next) {
    //send stats

    //get the actual messages object
    var messageBl = req.app.get('vegansMsgApp');

    var statsObject = {
        "messages": messageBl.MsgsInChat(),
        "users": messageBl.usersNumInChat()
    };

    res.json(statsObject).send();
};


function handleMethodNotAllowed(req, res, next) {
    var err = new Error();
    err.status = 405;
    next(err)
}
app.use(function(req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
});
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.send(err.status);
});

function isValid(req, res) {
    return !isNaN(req.query.counter) && typeof req.query.counter != 'undefined';
}


module.exports = app;