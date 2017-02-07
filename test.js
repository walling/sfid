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
