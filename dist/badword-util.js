var OBJECT = require('../data/object');
var ARRAY = require('../data/array');
var REGEX = require('../data/regexp');

var addBadWords = function addBadWords(badWords) {
    var regexStr = '';
    for (var i = 0; i < badWords.length; i++) {
        var badWord = badWords[i];
        //add to array
        ARRAY.push(badWord);
        //add to object
        OBJECT[badWord] = 1;
        //add to regexStr
        regexStr += '|' + badWord;
    }
    //add to regex
    var REGEXStr = REGEX.toString().substr(0, REGEX.toString().length - 16) + regexStr + '|@`-`@`-`@)\\b/gi';
    REGEX = new RegExp(REGEXStr);
    this.regex = new RegExp(REGEXStr);
}

var removeBadWords = function removeBadWords(words) {
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        //remove from array
        var wordIndex = ARRAY.indexOf(word);
        if (wordIndex !== -1) {
            ARRAY.splice(wordIndex, 1);
        }
        //remove from object
        if (OBJECT[word]) {
            delete OBJECT[word];
        }
        //remove from regexp
        var REGEXStr = REGEX.toString();
        var checkStr = '|' + word + '|';
        wordIndex = REGEXStr.indexOf(checkStr);
        if (wordIndex !== -1) {
            REGEXStr = REGEXStr.replace(checkStr, '');
            REGEX = new RegExp(REGEXStr);
            this.regex = new RegExp(REGEXStr);
        }
    }
}

var use = function use(dictionary) {
	var NEW_ARRAY = [];
	var NEW_OBJECT = {};
	var NEW_REGEX_STR = '/\b(';
	for(var i=0; i<dictionary.length; i++) {
		var word = dictionary[i];
		//push new array
		NEW_ARRAY.push(word);
		//add to new object
		NEW_OBJECT[word] = 1;
		//append to new regex string
		NEW_REGEX_STR += '|' + word;
	}
	NEW_REGEX_STR += '|@`-`@`-`@)\b/gi';

	//apply inside list
	ARRAY = NEW_ARRAY;
	OBJECT = NEW_OBJECT;
	REGEX = new RegExp(NEW_REGEX_STR);
	//apply to exported list
	this.array = NEW_ARRAY;
	this.object = NEW_OBJECT;
	this.regex = new RegExp(NEW_REGEX_STR);
}

var isBadWord = function isBadWord(word) {
    return OBJECT[word];
}

var findBadWords = function findBadWordsInText(text) {
    var badWordsFound = [];
    var textObj = {};
    text.trim().toLowerCase().split(' ').forEach(function(x) {
        textObj[x] = (textObj[x] || 0) + 1;
    });

    for (var i = 0; i < ARRAY.length; i++) {
        var badWord = ARRAY[i].toLowerCase();
        for (var key in textObj) {
            if (textObj.hasOwnProperty(key)) {
                if (key === badWord) {
                    badWordsFound.push({
                        content: key,
                        times: textObj[key]
                    });
                }
            }
        }
    }
    return badWordsFound;
}

var filterBadWords = function filterBadWords(text, badWords, character, numberOfChar) {
    if (!character || character === '') {
        character = '*';
    }
    if (!numberOfChar) {
        numberOfChar = 1000000;
    }
    if (badWords) {
        for (var i = 0; i < ARRAY.length; i++) {
            var badWord = ARRAY[i];
            if (text.indexOf(badWord) !== -1 && badWords.indexOf(badWord) !== -1) {
                var replaceStr = '';
                //generate replace string
                if (numberOfChar === 1000000 || numberOfChar >= badWord.length) {
                    replaceStr = Array(badWord.length + 1).join(character);
                } else {
                    var tmpBadWord = new String(badWord);
                    replaceStr = tmpBadWord.substr(0, tmpBadWord.length - numberOfChar) + Array(numberOfChar + 1).join(character);
                }
                text = text.replace(new RegExp(badWord, 'g'), replaceStr);
            }
        }
    } else {
        for (var i = 0; i < ARRAY.length; i++) {
            var badWord = ARRAY[i];
            if (text.indexOf(badWord) !== -1) {
                var replaceStr = '';
                //generate replace string
                if (numberOfChar === 1000000 || numberOfChar >= badWord.length) {
                    replaceStr = Array(badWord.length + 1).join(character);
                } else {
                    var tmpBadWord = new String(badWord);
                    replaceStr = tmpBadWord.substr(0, tmpBadWord.length - numberOfChar) + Array(numberOfChar + 1).join(character);
                }
                text = text.replace(new RegExp(badWord, 'gi'), replaceStr);
            }
        }
    }
    return text;
}

module.exports = {
    object: OBJECT,
    array: ARRAY,
    regex: REGEX,
    addBadWords: addBadWords,
    removeBadWords: removeBadWords,
    use: use,
    findBadWords: findBadWords,
    filterBadWords: filterBadWords,
    isBadWord: isBadWord
};
