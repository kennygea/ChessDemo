/*JS Handlers for the URL protocol and Meeting Software*/
$(document).ready(function() {

	
	var webRTC = $("#webRTC");
	
	
	var id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);
	var url = window.location.origin + "/conference/" + id;
	webRTC.attr("src", url); 

	
});