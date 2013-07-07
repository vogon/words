function haughtify() {
	var poem_id = $(this).closest(".contentBox")[0].id;

	$.post('/api/haughtify/' + poem_id, "", 
		function (e) { updateRatings(poem_id, e) });

	disableHaughty(poem_id);
}

function disableHaughty(poem_id) {
	var btn = $("#" + poem_id + " .haughtyButton");

	btn.off("click");
	btn.find("img")[0].src = "/images/Button_Haughty_Disabled.png";
}

function naughtify() {
	var poem_id = $(this).closest(".contentBox")[0].id;

	$.post('/api/naughtify/' + poem_id, "", 
		function (e) { updateRatings(poem_id, e) });

	disableNaughty(poem_id);
}

function disableNaughty(poem_id) {
	var btn = $("#" + poem_id + " .naughtyButton");

	btn.off("click");
	btn.find("img")[0].src = "/images/Button_Naughty_Disabled.png";
}

function updateRatings(poem_id, data) {
	console.log("should update ratings hhhhhere");
	console.log("poem_id: " + poem_id);
	console.log("event: " + data);

	data_obj = JSON.parse(data);

	$('#' + poem_id).find(".haughtyButton h3").text(data_obj["haughty"]);
	$('#' + poem_id).find(".naughtyButton h3").text(data_obj["naughty"]);
}

$(window).load(function () {
	$(".haughtyButton").click(haughtify);
	$(".naughtyButton").click(naughtify);

	console.log("hey hey hey");
});