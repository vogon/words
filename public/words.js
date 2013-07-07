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

	if ($(e.target).closest(".composerLineContent") ||
		$(e.target).closest(".wordList")) {
		if (e.preventDefault) {
			e.preventDefault();
		}

		e.originalEvent.dataTransfer.dropEffect = 'move';

		return false;
	} else {
		return true;
	}
}

function dropIntoComposer(e) {
	var dropX, dropY;
	dropX = e.originalEvent.x;
	dropY = e.originalEvent.y;

	var realDropTarget = $(e.target).closest(".composerLineContent");

	for (var childIndex = 0; childIndex < realDropTarget.children().length; childIndex++) {
		var child = realDropTarget.children()[childIndex];

		if (dropX < $(child).position().left) {
			console.log("drop X (" + dropX + ") before child " + childIndex + " X (" + $(child).position().left + ")");
			$(child).before(draggingMagnet);
			return false;
		} else {
			console.log("drop X (" + dropX + ") after child " + childIndex + " X (" + $(child).position().left + ")");
		}
	}

	console.log("drop X (" + dropX + ") after all children, appending");
	realDropTarget.append(draggingMagnet);
}

function dropIntoWordList(e) {
	var realDropTarget = $(e.target).closest(".wordList");

	realDropTarget.append(draggingMagnet);
}

function themeMode() {
	$('.wordTitlebox').addClass('hidden');
	$('.realTitlebox').removeClass('hidden');
}

function wordMode() {
	$('.realTitlebox').addClass('hidden');
	$('.wordTitlebox').removeClass('hidden');
}

function buildWord(word) {
	var magnet = $('<div draggable="true" class="words"><h1 class="magnet" /></div><br/>');
	magnet.children(".magnet").text(word);

	magnet.on("dragstart", handleMagnetDragStart);
	magnet.on("dragend", handleMagnetDragEnd);
	$('.wordList').append(magnet);
}

function buildWords(theme, words) {
	$(".titleLine").text(theme);

	for (var idx in words) {
		buildWord(words[idx]);
	}

	wordMode();
}

function getWords(themeId) {
	$.getJSON('/api/newpoem/' + themeId, function(data) {
		buildWords(data.theme, data.words);
	});
}

function chooseTheme(eventObject) {
	// walk up to the theme ID
	var themeId = $(this).closest('.themeId');
	$('#composeTitleSelect').text(themeId.find('.title').text());

	getWords(themeId[0].themeId);
}

function buildTheme(id, theme) {
	var dom = $('<li class="themeId"><h1 class="title"></h1></li>');
	dom.children(".title").text(theme);
	dom[0].themeId = id;

	dom.on("click", chooseTheme);
	$('.titleList').append(dom);
}

function buildThemes(themes) {
	for (var id in themes) {
		buildTheme(id, themes[id]);
	}

	themeMode();
}

function getThemes() {
	$.getJSON('/api/themes', function(data) {
		buildThemes(data);
	});
}

function showSaved() {
	$("#savedMessage").removeClass("hidden");
}

function submit() {
	var lines = [];

	$('.composerLineContent').each(function (index) {
		lines[index] = $(this).find('.magnet')
							  .map(function (index, word) { return word.innerText })
							  .get();
	});

	$.post('/api/submitpoem', JSON.stringify(lines), showSaved);

	// return words;
}

$(window).load(function () {
	$("#saveButton").click(submit);
	$(".wordList").on("dragover", handleMagnetDragOver);
	$(".wordList").on("drop", dropIntoWordList);

	$(".composerLineContent").on("dragover", handleMagnetDragOver);
	$(".composerLineContent").on("drop", dropIntoComposer);

	getThemes();

	console.log("hey hey hey");
});