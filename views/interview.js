'use strict';

/* globals MediaRecorder */
// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

var constraints = {audio: true,video: {  width: { min: 320, ideal: 320, max: 640 },  height: { min: 240, ideal: 240, max: 480 }}};

var recBtn = document.querySelector('button#rec');
var pauseResBtn = document.querySelector('button#pauseRes');
var stopBtn = document.querySelector('button#stop');

var videoElement = document.querySelector('video');
var dataElement = document.querySelector('#data');
var downloadLink = document.querySelector('a#downloadLink');
var nextLink = document.querySelector('a#nextLink');

videoElement.controls = false;

var mediaRecorder;
var chunks = [];
var count = 0;
var name;




function onBtnRecordClicked (){
	if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices.getUserMedia) {
		alert('MediaRecorder or navigator.mediaDevices.getUserMedia is NOT supported on your browser, use Firefox or Chrome instead.');
	}else {
		recBtn.disabled = true;
		pauseResBtn.disabled = false;
		stopBtn.disabled = false;

		navigator.mediaDevices.getUserMedia(constraints)
		.then(function(stream) {
			/* use the stream */
			if (typeof MediaRecorder.isTypeSupported == 'function'){
				/*
					MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
				*/
				if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
				  var options = {mimeType: 'video/webm;codecs=vp9'};
				} else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
				  var options = {mimeType: 'video/webm;codecs=h264'};
				} else  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
				  var options = {mimeType: 'video/webm;codecs=vp8'};
				}

				mediaRecorder = new MediaRecorder(stream, options);
			}else{

				mediaRecorder = new MediaRecorder(stream);
			}

			pauseResBtn.textContent = "Pause";

			mediaRecorder.start(10);

			videoElement.srcObject = stream;
			videoElement.play();

			stream.getTracks().forEach(function(track) {

				console.log(track.getSettings());
			})

			mediaRecorder.ondataavailable = function(e) {
				chunks.push(e.data);
			};

			mediaRecorder.onstop = function(){
				var blob = new Blob(chunks, {type: "video/webm"});
				chunks = [];

				var videoURL = window.URL.createObjectURL(blob);

				downloadLink.href = videoURL;
				videoElement.src = videoURL;
				downloadLink.innerHTML = 'Download video file';
				nextLink.innerHTML = "Next";

				var rand =  Math.floor((Math.random() * 10000000));
				name  = "video_"+ rand +".webm" ;

				downloadLink.setAttribute( "download", name);
				downloadLink.setAttribute( "name", name);

			};

			
		})
		.catch(function(err) {
			/* handle the error */


		});
	}
}

function onBtnStopClicked(){
	mediaRecorder.stop();
	videoElement.pause();
	videoElement.controls = false;

	recBtn.disabled = true;
	pauseResBtn.disabled = true;
	stopBtn.disabled = true;
	alert("Interview successfully recorded, save the video in a folder called \"interview\" in desktop and dont change the file name");
	
}

function onPauseResumeClicked(){
	if(pauseResBtn.textContent === "Pause"){
		pauseResBtn.textContent = "Resume";
		videoElement.pause();
		mediaRecorder.pause();
		stopBtn.disabled = true;
	}else{
		pauseResBtn.textContent = "Pause";
		mediaRecorder.resume();
		videoElement.play();
		stopBtn.disabled = false;
	}
	recBtn.disabled = true;
	pauseResBtn.disabled = false;
}
function addURL(element)
{
    $(element).attr('href', function() {
        return this.href + name;
    });
}







//browser ID
function getBrowser(){
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
		   (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}


	return browserName;
}