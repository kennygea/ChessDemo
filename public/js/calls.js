/*JS Handlers for the URL protocol and Meeting Software*/
$(document).ready(function() {

	

	var popout = $('#popout');
	var div = $('#startProgDiv');
	var launch = $('#launch');
	
	var divCall = $('#makeCall');
	var popoutCall = $('#popout2');
//	var call = $('#call');
	
	var webRTC = $("#webRTC");
	
	var appkey = $('#appkey');
	var dbpath = $('#dbpath');
	var ip = $('#ip');
	var accname = $('#accname');
	
	var callees = $('#callees');
	
	var createRoom = $("#createRoom");
	
	var id = Number(window.location.pathname.match(/\/chat\/(\d+)$/)[1]);
	var url = window.location.origin + "/conference/" + id;
	console.log(url);
	webRTC.attr("src", url); 

	popout.on('click', function() {
		if (div.css('display') === "none") {
			div.css('display', 'block');
		}
		else {
			div.css('display', 'none');
		}
		
	});
	
	launch.on('click', function() {
		var a = appkey.val();
		var b = dbpath.val();
		var c = ip.val();
		var d = accname.val();
		console.log(d)
		window.location.href = "freepp:bind@appkey=" + a + "&path="  + b +  "&rootcs="  + c + "&appacc=" + d;
	
	});
	
	popoutCall.on('click', function() {
		
		if (divCall.css('display') === "none") {
			divCall.css('display', 'block');
		}
		else {
			divCall.css('display', 'none');
		}
		
	});
	/*
	call.on('click', function() {
		var peeps = callees.val();
		console.log(peeps);
		window.location.href = "freepp:call@callee=" + peeps;
	});
	*/
	
	
});