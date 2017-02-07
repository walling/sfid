# Salesforce Id

This module enables you to easily work with Salesforce Ids. You can convert from short to long version of the Id, guess object type, and more. Check out the documentation below.


### Getting started

Install:

```bash
npm install --save sfid
```

Usage:

```js
var sfid = require('sfid');

console.log(sfid('80120000000test'));           // 80120000000testAAA
console.log(sfid.short('80120000000testAAA'));  // 80120000000test
```


### Command line usage

Here's some examples (`sfid --help` for more commands):

```bash
sfid 80120000000test             # 80120000000testAAA
sfid --short 80120000000testAAA  # 80120000000test
sfid --type 80120000000testAAA   # Order
```

You can also use to pipe files and normalize Ids:

```bash
sfid --cat < data.csv > data-fixed.csv
```


### Normalizing Ids

Salesforce Ids have two versions (15-character and 18-character). The long version includes a 3-character "checksum", which encodes the upper/lower case characters. This enables you to export Ids in systems which doesn't take case into account. If you're working with upper-case or lower-case Ids, you can use this module to normalize back to proper Ids. Example:

```
console.log(sfid('80120000000TESTAAA'));  // 80120000000testAAA
console.log(sfid('80120000000TESTAAE'));  // 80120000000tEstAAE
```

Remember if you cut of the checksum and work with 15-character version (short Id), the recovery of upper-case and lower-case characters is not possible.


### Guessing type

The type guessing is based on the prefix or the Id. The list is maintained in the [prefixes.json file](prefixes.json) and originally curated from resources found online [(a)](http://salesforcedevelopersclub.blogspot.de/2013/07/salesforce-object-id-prefixes.html) [(b)](http://www.fishofprey.com/2011/09/obscure-salesforce-object-key-prefixes.html). The information is provided as-is and is not 100% certain. Furthermore the function only tries to guess the type.

Example:

```js
console.log(sfid.guessType('80120000000testAAA'));  // Order
console.log(sfid.guessType('00120000000testAAA'));  // Account
```

If you work with custom types, you can register them to be recognized:

```js
sfid.registerPrefix('a02', 'MyCustomObject__c');
console.log(sfid.guessType('a0220000000testAAA'));  // MyCustomObject__c
```

For other custom objects, the function returns `'custom'` and for unknown types `'unknown'`. For invalid Ids the function returns an empty string `''`.


### Advanced example: Finding Ids in text

```js
var regexp = sfid.regexp();
var text   = '[log][info] 2017-02-03T07:14:55.234Z - Conversion complete - account: 00120000000testAAA - contact: 00320000000testAAA - not an id: 80120000000testXYZ';
var match;

while ((match = regexp.exec(text)) !== null) {
    if (!sfid.isValid(match[0])) { continue; }

    console.log('Found %s Id at position %s: %s', sfid.guessType(match[0]), match.index, match[0]);
}
```


### API

#### .long(id : String) -> String

Alias: `sfid(id)`

Converts to long Id (18-character). For 15-character Ids, it appends the checksum. For 18-character Ids, it normalizes the upper-case and lower-case characters. For invalid Ids, returns empty string `''`.

#### .short(id : String) -> String

First normalize using `sfid.long` function and then cut of the checksum. For invalid Ids, returns empty string `''`.

#### .isValid(id : String) -> Boolean

Checks if a value is a valid Id.

#### .guessType(id : String) -> String | Array<String>

Guess object type based on the Id prefix. For invalid Ids, returns empty string `''`.

#### .registerPrefix(prefix : String, objectName : String) -> Void

Adds a 3-character prefix to recognize using `sfid.guessType` function. Can be used for custom objects.

#### .checksum(id : String) -> String

Calculates 3-character checksum to append for an Id. Works for both 15- and 18-character Ids. The function assumes input is at least 15 characters long.

#### .regexp(completeMatch : Boolean) -> Regexp

Return regexp to use for searching for Ids in a text (default), or match completely (if `completeMatch` parameter is true).


### License

Code is licensed under MIT, please see [license.md file](license.md) for details.
