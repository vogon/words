var draggingMagnet = undefined;

function handleMagnetDragStart(e) {
	// alert("dragstart");
	e.originalEvent.dataTransfer.effectAllowed = 'move';
	draggingMagnet = this;
}

function handleMagnetDragEnd(e) {
	draggingMagnet = undefined;
}

function handleMagnetDragOver(e) {
	// alert("dragover");

	if (e.preventDefault) {
		e.preventDefault();
	}

	e.originalEvent.dataTransfer.dropEffect = 'move';

	return false;
}

function handleMagnetDrop(e) {
	// alert("drop");

	$(e.target).append(draggingMagnet);
}

function buildWord(word, x, y) {
	var span = $('<span class="magnet" draggable="true"/>');
	span.text(word);

	$(span).on("dragstart", handleMagnetDragStart);
	$(span).on("dragend", handleMagnetDragEnd);
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

	$.post('/api/submit', JSON.stringify(words), null, 'json');

	// return words;
}

$(window).load(function () {
	$(".submit-button").click(submit);
	$(".poem-row-words").on("dragover", handleMagnetDragOver);
	$(".poem-row-words").on("drop", handleMagnetDrop);

	$.getJSON('/api/choosewords', function(data) {
		console.log("hey hey hey");
		buildWords(data);
	});
});