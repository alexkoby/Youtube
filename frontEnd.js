console.log("Made it here");

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
	console.log(link);
});

