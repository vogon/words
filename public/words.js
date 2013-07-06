function buildWord(word, x, y) {
	var span = $('<span class="magnet" draggable="true"/>');
	span.text(word);
	span.draggable();

	$('body').append(span);
}

function buildWords(words) {
	for (var idx in words) {
		buildWord(words[idx], 100, 100);
	}
}

function submit() {
	var words = [];

	$('.magnet').each(function(index) {
		// console.log($(this));

		var pos = $(this).position();

		words[index] = 
			{
				word: $(this).text(),
				x: pos.left,
				y: pos.top
			};
	});

	$.post('/submit', JSON.stringify(words), null, 'json');

	// return words;
}

$(window).load(function () {
	$(".submit-button").click(submit);

	$.getJSON('/choosewords', function(data) {
		console.log("hey hey hey");
		buildWords(data);
	});
});