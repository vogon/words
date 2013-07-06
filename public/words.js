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

	if ($(e.target).hasClass("poem-row-words") || 
		$(e.target).parents().hasClass("poem-row-words")) {
		if (e.preventDefault) {
			e.preventDefault();
		}

		e.originalEvent.dataTransfer.dropEffect = 'move';

		return false;
	} else {
		return true;
	}
}

function handleMagnetDrop(e) {
	// alert("drop");

	// run through all the words in this line of the poem, drop in order
	var dropX, dropY;
	dropX = e.originalEvent.x;
	dropY = e.originalEvent.y;

	var realDropTarget = $(e.target).closest(".poem-row-words");

	for (var childIndex = 0; childIndex < realDropTarget.children().length; childIndex++) {
		var child = $(realDropTarget.children()[childIndex]);

		if (dropX < $(child).position().left) {
			console.log("drop X (" + dropX + ") before child " + childIndex + " X (" + $(child).position().left + ")");
			$(child).before(draggingMagnet);
			return false;
		} else {
			console.log("drop X (" + dropX + ") after child " + childIndex + " X (" + $(child).position().left + ")");
		}
	}

	console.log("drop X (" + dropX + ") after all children, appending");
	$(realDropTarget).append(draggingMagnet);
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
	var lines = [];

	$('.poem-row-words').each(function (index) {
		lines[index] = $(this).children('.magnet')
							  .map(function (index, word) { return word.innerText })
							  .get();
	});

	$.post('/api/submitpoem', JSON.stringify(lines), null, 'json');

	// return words;
}

$(window).load(function () {
	$(".submit-button").click(submit);
	$(".poem-row-words").on("dragover", handleMagnetDragOver);
	$(".poem-row-words").on("drop", handleMagnetDrop);

	$.getJSON('/api/newpoem', function(data) {
		buildWords(data.words);
	});

	console.log("hey hey hey");
});