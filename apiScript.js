 var player;
 var ss = io();

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

 function onPlayerReady(event) {
     console.log("Inside onPlayerReady" + player + " " + event);
     
     event.target.playVideo();

     console.log("Played");
 }

 function onError(){
 	console.log("An error occurred");
 }

 function onPlaybackRateChange(){
 	console.log("OnPlaybackRateChange");
 }

 function onStateChange(){
 	console.log("onStateChange");
 }

 var pauseButton = document.querySelector(".glyphicon-pause");
 pauseButton.addEventListener("click", function() {
     console.log("Clicked pause button");
     player.pauseVideo();
     console.log("Socket is: " + socket);
     socket.emit("pause", "Worked");
 });

 var playButton = document.querySelector(".glyphicon-play");
 playButton.addEventListener("click", function() {
     console.log("Clicked play button");
     player.playVideo();
 });


 var submitButton = document.querySelector("#submit");
 submitButton.addEventListener("click", function() {
     var link = document.getElementById("url").value.toString();
     for (var i = 0; i < link.length; i++) {
         if (link.charAt(i) == 'v' && link.charAt(i + 1) == '=') {
             var newVideo = link.substring(i + 2, i + 13);
             console.log(newVideo);
         }
     }
     console.log("Link is: " + link);

     player.cueVideoById(newVideo, 0, "large");
     player.pauseVideo();
 });
