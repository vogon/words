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

	if ($(e.target).hasClass("composerLineContent") || 
		$(e.target).parents().hasClass("composerLineContent")) {
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

	var realDropTarget = $(e.target).closest(".composerLineContent");

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
	var magnet = $('<div draggable="true" class="words"><h1 class="magnet" /></div>');
	magnet.children(".magnet").text(word);

	magnet.on("dragstart", handleMagnetDragStart);
	magnet.on("dragend", handleMagnetDragEnd);
	$('.wordList').append(magnet);
}

function buildWords(words) {
	for (var idx in words) {
		buildWord(words[idx], 100, 100);
	}
}

function submit() {
	var lines = [];

	$('.composerLineContent').each(function (index) {
		lines[index] = $(this).children('.magnet')
							  .map(function (index, word) { return word.innerText })
							  .get();
	});

	$.post('/api/submitpoem', JSON.stringify(lines), null, 'json');

	// return words;
}

$(window).load(function () {
	$(".saveButton").click(submit);
	$(".composerLineContent").on("dragover", handleMagnetDragOver);
	$(".composerLineContent").on("drop", handleMagnetDrop);

	$.getJSON('/api/newpoem', function(data) {
		buildWords(data.words);
	});

	console.log("hey hey hey");
});