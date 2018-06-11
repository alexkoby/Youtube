includeJS('/socket.js');
var socket = io();
var player;

//Executes once the youtube API is finished loading
function onYouTubeIframeAPIReady() {
    console.log("Inside onYouTubeIframeAPIReady");
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'NYfzmTbb8QY',
        disablekb: '1',
        events: {
            'onReady': onPlayerReady,
        }
    });
}

//Executes once the player is ready -- after onYoutubeIframeAPIReady()
function onPlayerReady(event) {
    console.log("Inside onPlayerReady" + player + " " + event);
    /*event.target.playVideo();
    console.log("Played");
    */
    socket.emit('ready', 'ready');
}

function onError() {
    console.log("An error occurred");
}

function onPlaybackRateChange() {
    console.log("OnPlaybackRateChange");
}

function onStateChange() {
    console.log("onStateChange");
}
//Pause button sends the word 'pause' in the channel 'event' when it's clicked
var pauseButton = document.querySelector(".glyphicon-pause");
pauseButton.addEventListener("click", function() {
    console.log("Clicked pause button");
    socket.emit('event', 'pause');
});
//Pause button sends the word 'play' in the channel 'event' when it's clicked
var playButton = document.querySelector(".glyphicon-play");
playButton.addEventListener("click", function() {
    socket.emit('event', 'play');
    console.log("Clicked play button");
});

//Submit button sends the newVideo code in the 'new link' channel when it's clicked
var submitButton = document.querySelector("#submit");
submitButton.addEventListener("click", function() {
    var link = document.getElementById("url").value.toString();
    for (var i = 0; i < link.length; i++) {
        if (link.charAt(i) == 'v' && link.charAt(i + 1) == '=') {
            var newVideo = link.substring(i + 2, i + 13);
            console.log(newVideo);
        }
    }
    console.log("Link is: " + newVideo);
    socket.emit('new link', newVideo);

});
//Link Changes
socket.on('new link', function(msg) {
    console.log("Received a new link in server");
    player.cueVideoById(msg, 0, "large");
    player.pauseVideo();
});
//When new user connects and asks everyone for their time
socket.on('time', function(msg){
    if(msg == 'time?'){
        socket.emit('isPlaying', player.getPlayerState());
        socket.emit('time', player.getCurrentTime());
    }
    else{
        player.seekTo(msg);
    }

});
//Pause or Play
socket.on('event', function(msg) {
    if (msg == 'play') {
        console.log("Event in apiScript inside play");
        player.playVideo();
    } else if (msg == 'pause') {
        player.pauseVideo();
    }
})

function includeJS(incFile) {
    document.write('<script type="text/javascript" src="' + incFile + '"></script>');
}
