var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var videoId = 'NYfzmTbb8QY'
var isPlaying = false;
var totalConnections = 0;
var peopleWhoSentTime = 0;
var totalTime = 0;

//ensures files are in proper spot
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

//triggers when someone connects to websocket by visiting website
io.on('connection', function(socket) {
    console.log('a user connected. Total connections: ' + ++totalConnections);

    //Determines whether other people are currently watching or not
    socket.on('isPlaying', function(msg){
    	if(msg == 1){
    		console.log("Determined other videos were playing");
    		isPlaying = true;
    	}
    	else if(msg == 2){
    		console.log("Determined other videos were not playing");
    		isPlaying = false;
    	}
    });

    //triggers when someone disconnects from website
    socket.on('disconnect', function() {
        console.log('user disconnected. Total connections: ' + --totalConnections);
    });
    //when new user connects while others are already watching 
    socket.on('ready', function(msg) {
    	io.emit('event', 'pause');
    	if(msg == 'ready'){
    		socket.emit('new link', videoId);
    		socket.broadcast.emit('time','time?');
    	}
    });
    //When people send back their times
    socket.on('time', function(msg){
    	totalTime += msg;
    	peopleWhoSentTime++;
    	console.log("One person sent time: " + msg);

    	if(peopleWhoSentTime == totalConnections - 1){

    		io.emit('time', totalTime/(totalConnections - 1));
    		peopleWhoSentTime = 0;
    		totalTime = 0;
    		if(isPlaying){
    			console.log("Told others we're playing");
    			io.emit('event', 'play');
    		}
    		else{
    			console.log("Told others we're pausing");
    			io.emit('event', 'pause');
    		}
    	}
    });



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
        //console.log("Event was: " + msg);
        if (msg == 'play') {
            console.log("Event inside 'play'");
            io.emit('event', 'play');
        } else if (msg == 'pause') {
            io.emit('event', 'pause');
        }
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
