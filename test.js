'use strict';

var assert  = require('assert');
var sfid    = require('.');

assert.equal('80120000000testAAA' , sfid('80120000000testAAA'));
assert.equal('80120000000testAAA' , sfid('80120000000test'));
assert.equal('80120000000testAAA' , sfid('80120000000TESTAAA'));
assert.equal('80120000000tEsTAAU' , sfid('80120000000TESTAAU'));
assert.equal('80120000000TestAAC' , sfid('80120000000TESTAAC'));
assert.equal('80120000000tEstAAE' , sfid('80120000000TESTAAE'));
assert.equal('80120000000teStAAI' , sfid('80120000000TESTAAI'));
assert.equal('80120000000tesTAAQ' , sfid('80120000000TESTAAQ'));
assert.equal('80120000000testAAA' , sfid('80120000000testaaa'));
assert.equal(''                   , sfid('80120000000testAA7'));
assert.equal(''                   , sfid('80120000000T4STAAP'));
assert.equal(''                   , sfid('80120000000testXYZ'));
assert.equal(''                   , sfid('xyz'));
assert.equal(''                   , sfid(null));

assert.equal('80120000000testAAA' , sfid.long('80120000000testAAA'));
assert.equal('80120000000testAAA' , sfid.long('80120000000test'));
assert.equal('80120000000testAAA' , sfid.long('80120000000TESTAAA'));
assert.equal('80120000000testAAA' , sfid.long('80120000000testaaa'));
assert.equal(''                   , sfid.long('80120000000testAA7'));
assert.equal(''                   , sfid.long('80120000000T4STAAP'));
assert.equal(''                   , sfid.long('80120000000testXYZ'));
assert.equal(''                   , sfid.long('xyz'));
assert.equal(''                   , sfid.long(null));

assert.equal('80120000000test' , sfid.short('80120000000testAAA'));
assert.equal('80120000000test' , sfid.short('80120000000test'));
assert.equal('80120000000test' , sfid.short('80120000000TESTAAA'));
assert.equal('80120000000test' , sfid.short('80120000000testaaa'));
assert.equal(''                , sfid.short('80120000000testAA7'));
assert.equal(''                , sfid.short('80120000000T4STAAP'));
assert.equal(''                , sfid.short('80120000000testXYZ'));
assert.equal(''                , sfid.short('xyz'));
assert.equal(''                , sfid.short(null));

assert.equal(true  , sfid.isValid('80120000000testAAA'));
assert.equal(true  , sfid.isValid('80120000000test'));
assert.equal(true  , sfid.isValid('80120000000TESTAAA'));
assert.equal(true  , sfid.isValid('80120000000testaaa'));
assert.equal(false , sfid.isValid('80120000000testXYZ'));
assert.equal(false , sfid.isValid('xyz'));
assert.equal(false , sfid.isValid(null));

assert.equal('Order' , sfid.guessType('80120000000testAAA'));
assert.equal('Order' , sfid.guessType('80120000000test'));
assert.equal('Order' , sfid.guessType('80120000000TESTAAA'));
assert.equal('Order' , sfid.guessType('80120000000testaaa'));
assert.equal(null    , sfid.guessType('80120000000testXYZ'));
assert.equal(null    , sfid.guessType('xyz'));
assert.equal(null    , sfid.guessType(null));

assert.throws(function() { sfid.registerPrefix('Invalid'); });
assert.throws(function() { sfid.registerPrefix(''); });
assert.throws(function() { sfid.registerPrefix(null); });
sfid.registerPrefix('tst', 'MyType1');
sfid.registerPrefix('TST', [ 'MyType2', 'MyType3' ]);
assert.equal('MyType1' , sfid.guessType('tst20000000testAAA'));
assert.equal('MyType2' , sfid.guessType('TST20000000testHAA')[0]);
assert.equal('MyType3' , sfid.guessType('TST20000000testHAA')[1]);

assert.equal('AAA' , sfid.checksum('80120000000testAAA'));
assert.equal('AAA' , sfid.checksum('80120000000test'));
assert.equal('AAA' , sfid.checksum('80120000000testXYZ'));
assert.equal('555' , sfid.checksum(''));
assert.throws(function() { sfid.checksum(null); });

assert.equal(true  , sfid.regexp().test(' 80120000000testAAA '));
assert.equal(true  , sfid.regexp().test(' 80120000000test '));
assert.equal(true  , sfid.regexp().test(' 80120000000testXYZ '));
assert.equal(false , sfid.regexp().test(' xyz '));
assert.equal(true  , sfid.regexp(true).test('80120000000testAAA'));
assert.equal(true  , sfid.regexp(true).test('80120000000test'));
assert.equal(true  , sfid.regexp(true).test('80120000000testXYZ'));
assert.equal(false , sfid.regexp(true).test('xyz'));
assert.equal(false , sfid.regexp(true).test(' 80120000000testAAA '));
assert.equal(false , sfid.regexp(true).test(' 80120000000test '));


/***** Check a lot of well-formed id patterns *****/

var ids = {
    '0012A00001aaAaaQAE' : 'Account',
    '0012000001A10aAAAR' : 'Account',
    '0012000001A1AA0AAN' : 'Account',
    '0012000001AAaa1AAD' : 'Account',
    '0012000001Aa011AAB' : 'Account',
    '0012000001Aa1AaAAJ' : 'Account',
    '0012000001AaAA1AAN' : 'Account',
    '0012000001AaAAaAAN' : 'Account',
    '0012000001aA1aaAAC' : 'Account',
    '0012000001aAAaaAAG' : 'Account',
    '0032A00001aAAAAQA4' : 'Contact',
    '0032000001AAaaAAAT' : 'Contact',
    '0032000001AaAAAAA3' : 'Contact',
    '0032000001AaaaaAAB' : 'Contact',
    '0032000001a1aAAAAY' : 'Contact',
    '0032000001aAAAAAA4' : 'Contact',
    '0032000001aAAAaAAO' : 'Contact',
    '0032000001aAaaAAAS' : 'Contact',
    '0032000001aaaA1AAI' : 'Contact',
    '0032000001aaaaaAAA' : 'Contact',
    '0052A00000111aAQAQ' : 'User',
    '005200000010AaaAAE' : 'User',
    '0052000000111AaAAI' : 'User',
    '005200000011AAAAA2' : 'User',
    '005200000011AAaAAM' : 'User',
    '005200000011aAAAAY' : 'User',
    '00520000001AAA1AAO' : 'User',
    '00520000001AaAAAA0' : 'User',
    '00520000001a1a1AAA' : 'User',
    '00520000001aAaaAAE' : 'User',
    '0062A00000aAaAaQAK' : 'Opportunity',
    '0062A00000aa1AaQAI' : 'Opportunity',
    '0062000000a1AAaAAM' : 'Opportunity',
    '0062000000a1AaaAAE' : 'Opportunity',
    '0062000000a1a1aAAA' : 'Opportunity',
    '0062000000aA1AAAA0' : 'Opportunity',
    '0062000000aAAAAAA4' : 'Opportunity',
    '0062000000aa1aAAAQ' : 'Opportunity',
    '0062000000aaa0AAAQ' : 'Opportunity',
    '0062000000aaaaaAAA' : 'Opportunity',
    '00Q2A00000a11aAUAQ' : 'Lead',
    '00Q2000000a1AAAEA2' : 'Lead',
    '00Q2000000a1aAAEAY' : 'Lead',
    '00Q2000000aAAa1EAG' : 'Lead',
    '00Q2000000aAa1aEAC' : 'Lead',
    '00Q2000000aAaAAEA0' : 'Lead',
    '00Q2000000aAaaaEAC' : 'Lead',
    '00Q2000000aaAaAEAU' : 'Lead',
    '00Q2000000aaaAAEAY' : 'Lead',
    '00Q2000000aaaAaEAI' : 'Lead',
    '8012A000001AAAaQAO' : 'Order',
    '801200000001AaaAAE' : 'Order',
    '801200000001a1AAAQ' : 'Order',
    '801200000001aaAAAQ' : 'Order',
    '80120000000AAaAAAW' : 'Order',
    '80120000000Aa11AAC' : 'Order',
    '80120000000aAaaAAE' : 'Order',
    '80120000000aaAaAAI' : 'Order',
    '80120000000aaaaAAA' : 'Order',
    '80120000001AAA1AAO' : 'Order',
    'a012A00000A11aAQAR' : 'custom',
    'a012A00000AAAA1QAP' : 'custom',
    'a012A00000AAaAaQAL' : 'custom',
    'a012000000A11aAAAR' : 'custom',
    'a012000000AAAaAAAX' : 'custom',
    'a01200000aAAAaAAAX' : 'custom',
    'a012000000Aa1aaAAB' : 'custom',
    'a012000000AaAA1AAN' : 'custom',
    'a012000000AaAAAAA3' : 'custom',
    'a012000000AaaAaAAJ' : 'custom'
};

Object.keys(ids).forEach(function(id) {
    assert.equal(id, sfid(id));
    assert.equal(id, sfid(id.toUpperCase()));
    assert.equal(id, sfid(id.toLowerCase()));
    assert.equal(id, sfid(id.substring(0, 15)));

    assert.equal(id, sfid.long(id));
    assert.equal(id, sfid.long(id.toUpperCase()));
    assert.equal(id, sfid.long(id.toLowerCase()));
    assert.equal(id, sfid.long(id.substring(0, 15)));

    assert.equal(id.substring(0, 15), sfid.short(id));
    assert.equal(id.substring(0, 15), sfid.short(id.substring(0, 15)));

    assert.equal(ids[id], sfid.guessType(id));
    assert.equal(ids[id], sfid.guessType(id.toUpperCase()));
    assert.equal(ids[id], sfid.guessType(id.toLowerCase()));
    assert.equal(ids[id], sfid.guessType(id.substring(0, 15)));
});
