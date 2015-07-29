/*JS Handlers for the URL protocol and Meeting Software*/
$(document).ready(function() {

	var popout = $('#popout');
	var div = $('#startProgDiv');
	var launch = $('#launch');
	
	var divCall = $('#makeCall');
	var popoutCall = $('#popout2');
	var call = $('#call');
	
	
	var appkey = $('#appkey');
	var dbpath = $('#dbpath');
	var ip = $('#ip');
	var accname = $('#accname');
	
	var callees = $('#callees');

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
	
	call.on('click', function() {
		var peeps = callees.val();
		console.log(peeps);
		window.location.href = "freepp:call@callee=" + peeps;
	});
	
	
});