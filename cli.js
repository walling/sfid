#!/usr/bin/env node
'use strict';

var util    = require('util');
var path    = require('path');
var sfid    = require('.');
var args    = process.argv.slice(2);
var options = { _ : [] };

// Supported option flags
var flags = {
    long    : 'Convert to long Ids (18-character)',
    short   : 'Convert to short Ids (15-character)',
    cat     : 'Read Ids from stdin and output results on stdout',
    type    : 'Guess type of Id',
    quiet   : 'Be more quiet',
    version : 'Show version',
    help    : 'Display help'
};

// Generate help text to display (optional error message)
function helpText(message) {
    if (message && options.quiet) { return message; }

    var text = '';
    if (message) { text += message+'\n\n'; }
    text += util.format('Usage: %s [options] <sfid>\n\n', path.basename(process.argv[1]));
    text += 'Pass one or more Ids as command line argument or stdin in cat mode.\n\nOptions:\n\n';

    Object.keys(flags).forEach(function(flag) {
        var line = util.format('    --%s -%s', flag, flag[0]);
        line += ' '.repeat(20 - line.length);
        text += line + flags[flag] + '\n';
    });

    return text;
}

// Parse command line arguments
while (args.length > 0) {
    var arg = args.shift();

    // Take rest of arguments as-is
    if (arg === '--') {
        options._ = options._.concat(args);
        args = [];
        continue;
    }

    // Check if argument match a flag
    for (var flag in flags) {
        if (arg === '--'+flag || arg === '-'+flag[0]) {
            options[flag] = true;
            arg = undefined;
            break;
        }
    }

    // Continue if already parsed
    if (arg === undefined) { continue; }

    // Unknown argument: Add to generic list as-is
    options._.push(arg);
}

// Show version
if (options.version) {
    console.log(require('./package.json').version);
    process.exit(0);
}

// Display help
if (options.help || process.argv.length === 2) {
    console.log(helpText());
    process.exit(0);
}

// Check invalid combination with long/short
if (options.long && options.short) {
    console.error(helpText('Error: You can\'t pass both --long and --short at the same time. Please choose only one.'));
    process.exit(1);
}

// Check invalid combination with stdin/args
if (options.cat && options._.length > 0) {
    console.error(helpText('Error: You passed Ids as command line arguments in cat mode. In this mode, please pass Ids on stdin.'));
    process.exit(1);
}

// Based on command line options, decide which converter function to use
var converter =
    options.type  ? sfid.guessType :
    options.short ? sfid.short     :
                    sfid.long      ;

// For normal mode, just output results one-per-line
if (!options.cat) {
    options._.forEach(function(id) {
        console.log(converter(id) || "-");
    });
    if (options._.length === 0 && !options.quiet) {
        console.error('(no ids given)');
    }
    process.exit(0);
}

// For cat mode, read one Id per line and output result
var regexp = sfid.regexp();
require('readline').createInterface({
    input  : process.stdin,
    output : process.stdout
}).on('line', function(line) {
    console.log(line.replace(regexp, function(id) {
        return converter(id) || id;
    }));
}).setPrompt('');
