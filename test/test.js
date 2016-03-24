var assert = require('assert');
var list = require('../dist/badword-util');

describe('filter', function(){
  it('The list should contain property array, object and regex', function(){
    assert(list.hasOwnProperty('array'));
    assert(list.hasOwnProperty('object'));
    assert(list.hasOwnProperty('regex'));
  });

  it('Bad words should be added', function() {
    list.addBadWords(['abc', 'def']);
    assert(list.object.hasOwnProperty('abc'));
    assert(list.object.hasOwnProperty('def'));
    assert(list.array.indexOf('abc') !== -1);
    assert(list.array.indexOf('def') !== -1);
    assert(list.regex.toString().indexOf('|abc|def') !== -1);
  });

  it('Bad words should be removed', function() {
    list.removeBadWords(['abc', 'def']);
    assert(!list.object.hasOwnProperty('abc'));
    assert(!list.object.hasOwnProperty('def'));
    assert(list.array.indexOf('abc') === -1);
    assert(list.array.indexOf('def') === -1);
    assert(list.regex.toString().indexOf('|abc|def') === -1);
  });

  it('New Dictionary should be used instead of default then revert', function() {
    var oldDictionary = list.array;
    list.use(['abc', 'def', 'ghi']);
    assert(list.array.indexOf('abc') !== -1);
    assert(list.array.indexOf('def') !== -1);
    assert(list.array.indexOf('ghi') !== -1);
    assert(list.array.indexOf('fuck') === -1);
    assert(list.array.indexOf('shit') === -1);
    list.use(oldDictionary);
    assert(list.array.indexOf('abc') === -1);
    assert(list.array.indexOf('def') === -1);
    assert(list.array.indexOf('ghi') === -1);
    assert(list.array.indexOf('fuck') !== -1);
    assert(list.array.indexOf('shit') !== -1);
  });

  it('Bad words should be found', function() {
    var badWords = list.findBadWords('fuck you all, you are shit you know, shit');
    assert(badWords[0].content === 'fuck');
    assert(badWords[1].content === 'shit');
    assert(badWords[0].times === 1);
    assert(badWords[1].times === 2);
  });

  it('Bad words should be not found', function() {
    var badWords = list.findBadWords('fuckyou all, you are shit.you know');
    assert(badWords.length === 0);
  });

  it('Bad words should be replace', function() {
    var goodOne = list.filterBadWords('fuck you all, you are shit and ass as you know');
    assert(goodOne.indexOf('shit') === -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('****') !== -1);
    assert(goodOne.indexOf('***') !== -1);

    goodOne = list.filterBadWords('fuck you all, you are shit and ass as you know', null, '#');
    assert(goodOne.indexOf('shit') === -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('####') !== -1);
    assert(goodOne.indexOf('###') !== -1);

    goodOne = list.filterBadWords('fuck you all, you are shit and ass as you know', ['fuck','ass']);
    assert(goodOne.indexOf('shit') !== -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('****') !== -1);
    assert(goodOne.indexOf('***') !== -1);
    
    goodOne = list.filterBadWords('fuck you all, you are shit and ass as you know', ['fuck','ass'], '#');
    assert(goodOne.indexOf('shit') !== -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('####') !== -1);
    assert(goodOne.indexOf('###') !== -1);

    goodOne = list.filterBadWords('fuck you all, you are shit and ass as you know', ['fuck','ass'], '#', 2);  
    assert(goodOne.indexOf('shit') !== -1);
    assert(goodOne.indexOf('fuck') === -1);
    assert(goodOne.indexOf('ass') === -1);
    assert(goodOne.indexOf('fu##') !== -1);
    assert(goodOne.indexOf('a##') !== -1);
    assert(goodOne.indexOf('####') === -1);
    assert(goodOne.indexOf('###') === -1);
  });

  it('"fuck" should be a bad word and "love" shouldn\'t', function() {
    var result = list.isBadWord('fuck');
    assert(result);
    result = list.isBadWord('love');
    assert(!result);
  });
});