# badword-util

- A highly consumable list of bad (profanity) English words
- Some ultilities functions for check badwords, find badwords, filter badwords...
- No dependencies

# Install

    npm install badword-util

# Usage

    var bwut = require('badword-util');

## Get badwords data

This data has been exposed as
- an array
- an object
- a regular expression

depending on what is required for your purposes.

- var badwordArray = bwut.array;
- var badwordObject = bwut.object;
- var badwordRegex = bwut.regex;

## Change badwords data

### Add more badwords
> bwut.addBadWords([...]);

```javascript
it('Bad words should be added', function() {
    bwut.addBadWords(['abc', 'def']);
    assert(bwut.object.hasOwnProperty('abc'));
    assert(bwut.object.hasOwnProperty('def'));
    assert(bwut.array.indexOf('abc') !== -1);
    assert(bwut.array.indexOf('def') !== -1);
    assert(bwut.regex.toString().indexOf('|abc|def') !== -1);
  });
```
### Remove badwords
> bwut.removeBadWords([...]);

```javascript
it('Bad words should be removed', function() {
	bwut.removeBadWords(['abc', 'def']);
	assert(!bwut.object.hasOwnProperty('abc'));
	assert(!bwut.object.hasOwnProperty('def'));
	assert(bwut.array.indexOf('abc') === -1);
	assert(bwut.array.indexOf('def') === -1);
	assert(bwut.regex.toString().indexOf('|abc|def') === -1);
});
```

### Apply new dictionary
> bwut.use([...]);

```javascript
it('New Dictionary should be used instead of default then revert', function() {
    var oldDictionary = bwut.array;
    bwut.use(['abc', 'def', 'ghi']);
    assert(bwut.array.indexOf('abc') !== -1);
    assert(bwut.array.indexOf('def') !== -1);
    assert(bwut.array.indexOf('ghi') !== -1);
    assert(bwut.array.indexOf('fuck') === -1);
    assert(bwut.array.indexOf('shit') === -1);
    bwut.use(oldDictionary);
    assert(bwut.array.indexOf('abc') === -1);
    assert(bwut.array.indexOf('def') === -1);
    assert(bwut.array.indexOf('ghi') === -1);
    assert(bwut.array.indexOf('fuck') !== -1);
    assert(bwut.array.indexOf('shit') !== -1);
});
```

## Badword utilities functions

### Check if a word is bad word
> var check = bwut.isBadWord(wordToCheck);

```javascript
it('"fuck" should be a bad word and "love" shouldn\'t', function() {
	var result = bwut.isBadWord('fuck'); //true
	assert(result);
	result = bwut.isBadWord('love'); // false
	assert(!result);
});
```

### Find bad word(s) in text
> var badWords = bwut.findBadWords(text);
> return an array of object with structure {content: 'bad word content', times: 'number of time this bad word had occurred'}

```javascript
it('Bad words should be found', function() {
	var badWords = bwut.findBadWords('fuck you all, you are shit you know, shit');
	//badWords will be [{content: 'fuck', times: 1}, {content: 'shit', times: 2}]
	assert(badWords[0].content === 'fuck');
	assert(badWords[1].content === 'shit');
	assert(badWords[0].times === 1);
	assert(badWords[1].times === 2);
});
```

### Filter bad word(s) in text
> var godOne = bwut.filterBadWords(text, badWords, character, numberOfChar);
> replace bad word found in text
>> - badwords here is array which restrict bad words to check
>> - character here is the character will be replace for each character of bad word, if character is undefined or null or empty then '*' will be use
>> - numberOfChar here is the number character of bad word will be replace by character count from the end of bad word 
>> (eg: found bad word 'fuck' with numberOfChar is 2 then the result will be 'fu**'), 
>> if numberOfChar is undefined or null or bigger than bad word's length then all bad word's character will be replace.

```javascript
it('Bad words should be replace', function() {
    var goodOne = bwut.filterBadWords('fuck you all, you are shit and ass as you know');
    assert(goodOne.indexOf('shit') === -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('****') !== -1);
    assert(goodOne.indexOf('***') !== -1);

    goodOne = bwut.filterBadWords('fuck you all, you are shit and ass as you know', null, '#');
    assert(goodOne.indexOf('shit') === -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('####') !== -1);
    assert(goodOne.indexOf('###') !== -1);

    goodOne = bwut.filterBadWords('fuck you all, you are shit and ass as you know', ['fuck','ass']);
    assert(goodOne.indexOf('shit') !== -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('****') !== -1);
    assert(goodOne.indexOf('***') !== -1);
    
    goodOne = bwut.filterBadWords('fuck you all, you are shit and ass as you know', ['fuck','ass'], '#');
    assert(goodOne.indexOf('shit') !== -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('####') !== -1);
    assert(goodOne.indexOf('###') !== -1);

    goodOne = bwut.filterBadWords('fuck you all, you are shit and ass as you know', ['fuck','ass'], '#', 2);  
    assert(goodOne.indexOf('shit') !== -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('fu##') !== -1);
    assert(goodOne.indexOf('a##') !== -1);
    assert(goodOne.indexOf('####') === -1);
    assert(goodOne.indexOf('###') === -1);
});
```

## Testing
=======

### Requires Mocha

### Script
```javascript
npm install
npm test
```
