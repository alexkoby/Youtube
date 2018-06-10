var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var videoId = 'NYfzmTbb8QY'

//ensures files are in proper spot
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

//triggers when someone connects to websocket by visiting website
io.on('connection', function(socket) {
    console.log('a user connected');

    //triggers when someone disconnects from website
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    //triggers when new user connects and API is finished loading
    socket.on('ready', function(msg) {
    	if(msg == 'ready'){
    		socket.emit('new link', videoId);
    	}
    })

    //Triggers when websocket gets a $msg from the 'new link' channel, which occurs when the user hits the submit button
    socket.on('new link', function(msg) {
    	videoId = msg;
        //socket.emit('channel', 'msg') -- sends to only person who caused the command
        //io.emit('channel', 'msg') -- sends too all people connected
        io.emit('new link', msg);
        console.log("New link: " + msg);
    });
    //Triggers when websocket gets a $msg from the 'event' channel, which occurs when the user hits either the pause or play button
    socket.on('event', function(msg) {
        console.log("Event was: " + msg);
        if (msg == 'play') {
            console.log("Event inside 'play'")
            io.emit('event', 'play');
        } else if (msg == 'pause') {
            io.emit('event', 'pause');
        }
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
