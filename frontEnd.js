includeJS('/socket.io/socket.io.js');
var socket = io();

 var pauseButton = document.querySelector(".glyphicon-pause");
 pauseButton.addEventListener("click", function() {
     console.log("Clicked pause button");
     player.pauseVideo();
 });

var playButton = document.querySelector(".glyphicon-play");
playButton.addEventListener("click", function(){
	console.log("Clicked play button");
});

var submitButton = document.querySelector("#submit");
submitButton.addEventListener("click", function(){
	var link = document.getElementById("url").innerText;
	socket.emit('new link', link);
	console.log(link);
});

function includeJS(incFile)
{
   document.write('<script type="text/javascript" src="'+ incFile+ '"></script>');
}
