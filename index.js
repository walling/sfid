'use strict';

var prefixes = require('./prefixes');

var checksumAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ012345';
function sfidChecksum(id) {
    var bin1 =
        ((~id.charCodeAt(0) >> 5 & 1) << 4) |
        ((~id.charCodeAt(1) >> 5 & 1) << 3) |
        ((~id.charCodeAt(2) >> 5 & 1) << 2) |
        ((~id.charCodeAt(3) >> 5 & 1) << 1) |
        ((~id.charCodeAt(4) >> 5 & 1) << 0);

    var bin2 =
        ((~id.charCodeAt(5) >> 5 & 1) << 4) |
        ((~id.charCodeAt(6) >> 5 & 1) << 3) |
        ((~id.charCodeAt(7) >> 5 & 1) << 2) |
        ((~id.charCodeAt(8) >> 5 & 1) << 1) |
        ((~id.charCodeAt(9) >> 5 & 1) << 0);

    var bin3 =
        ((~id.charCodeAt(10) >> 5 & 1) << 4) |
        ((~id.charCodeAt(11) >> 5 & 1) << 3) |
        ((~id.charCodeAt(12) >> 5 & 1) << 2) |
        ((~id.charCodeAt(13) >> 5 & 1) << 1) |
        ((~id.charCodeAt(14) >> 5 & 1) << 0);

    return checksumAlphabet[bin1] + checksumAlphabet[bin2] + checksumAlphabet[bin3];
}

function sfidRegexp(completeMatch) {
    return completeMatch ?
        /^[A-Za-z0-9]{15}(?:[A-Za-z0-9]{3})?$/ :
        /[A-Za-z0-9]{15}(?:[A-Za-z0-9]{3})?/g;
}

var idRegexp = sfidRegexp(true);
function sfidLongId(id) {
    // Ensure string and check basic format
    id = '' + id;
    if (!idRegexp.test(id)) { return ''; }

    // For 15-chars (short) id, we append the checksum
    if (id.length === 15) { return id + sfidChecksum(id); }

    // For 18-chars (long) id, we verify the checksum
    if (id.substring(15, 18) === sfidChecksum(id)) { return id; }

    // From here on we assume the checksum is valid for the 18-chars id, so we correct the case of the first part of the id. Fx. this fixes ids that were fully upper-cased.

    // Parse checksum
    var checksum = id.substring(15, 18).toUpperCase();
    var bins = [
        checksumAlphabet.indexOf(checksum[0]),
        checksumAlphabet.indexOf(checksum[1]),
        checksumAlphabet.indexOf(checksum[2])
    ];

    // Invalid checksum
    if (bins[0] === -1 || bins[1] === -1 || bins[2] === -1) { return ''; }

    // Make each character of 15-chars (short) id upper case according to checksum
    id = id.substring(0, 15).toLowerCase();

    for (var i = 0; i < 3; i++) {
        var bin = bins[i];
        for (var position = i * 5 + 4; bin; position--, bin >>= 1) {
            if (bin & 1) {
                // Invalid character (not A-Z)
                if (id.charCodeAt(position) < 97) { return ''; }

                // Make position upper-case
                id = id.substring(0, position) + id[position].toUpperCase() + id.substring(position + 1);
            }
        }
    }

    // Return id with correct upper/lower case
    return id + checksum;
}

function sfidShortId(id) {
    return sfidLongId(id).substring(0, 15);
}

function sfidIsValid(id) {
    return !!sfidLongId(id);
}

function sfidGuessType(id) {
    id = sfidLongId(id);
    if (id.substring(0, 2) === 'a0') { return 'custom'; }
    return id ? (prefixes[id.substring(0, 3)] || 'unknown') : null;
}

function sfidRegisterPrefix(prefix, objectName) {
    prefix = '' + prefix;
    if (!/^[A-Za-z0-9]{3}$/.test(prefix)) { throw new Error('Invalid prefix: ' + prefix); }

    prefixes[prefix] = Array.isArray(objectName) ? objectName.map(function(name) { return '' + name; }) : '' + objectName;
}

exports = module.exports = sfidLongId;
exports.long             = sfidLongId;
exports.short            = sfidShortId;
exports.isValid          = sfidIsValid;
exports.guessType        = sfidGuessType;
exports.registerPrefix   = sfidRegisterPrefix;
exports.checksum         = sfidChecksum;
exports.regexp           = sfidRegexp;
