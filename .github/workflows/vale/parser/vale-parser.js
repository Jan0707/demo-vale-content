'use strict';

// Mapping from Vale's output format:
// {
//     'README.md': [
//       {
//         Action: [Object],
//         Span: [Array],
//         Check: 'custom.punctuation-in-headlines',
//         Description: '',
//         Link: 'https://docs.microsoft.com/en-us/style-guide/punctuation/periods',
//         Message: "Don't use end punctuation in headings.",
//         Severity: 'warning',
//         Match: 'd!',
//         Line: 1
//       }
//     ]
// }
//
// To Reviewdog's RDF format (https://github.com/reviewdog/reviewdog/tree/master/proto/rdf):
// {
//     "source": {
//       "name": "vale",
//       "url": "https://vale.sh/docs/"
//     },
//     "severity": "WARNING",
//     "diagnostics": [
//       {
//         "message": "<msg>",
//         "location": {
//           "path": "<file path>",
//           "range": {
//             "start": {
//               "line": 14,
//               "column": 15
//             }
//           }
//         },
//         "severity": "ERROR",
//         "code": {
//           "value": "RULE1",
//           "url": "https://example.com/url/to/super-lint/RULE1"
//         }
//       }
//     ]
//   }

const fs = require('fs');

// Remove 'node' and filepath from the list then get the first actual arg
const filepath = process.argv.slice(2)[0];

const rawData = fs.readFileSync(filepath);
const inputData = JSON.parse(rawData);

const output = {
     source: {
       name: 'Vale',
       url: 'https://vale.sh/docs/'
     },
     severity: null,
     diagnostics: []
};

for (let filename in inputData) {
    const valeFileResults = inputData[filename];

    const diagnostics = valeFileResults.map((valeFileResult) => {
        const diagnostic = {
            message: valeFileResult.Message,
            location: {
                path: filename,
                range: {
                    start: {
                        line: valeFileResult.Line,
                        column: valeFileResult.Span[0]
                    }
                }
            },
            severity: valeFileResult.Severity.toUpperCase(),
            code: {
                value: valeFileResult.Check,
                url: valeFileResult.Link
            }
        };

        return diagnostic
    });

    output.diagnostics = Array.prototype.concat(output.diagnostics, diagnostics);
}

// Set final RDF severity to highest severity that was found in all results
const allSeverities = output.diagnostics.map((diagnostic) => diagnostic.severity);
if (allSeverities.indexOf('ERROR') >= 0) {
    output.severity = 'ERROR'
} else if (allSeverities.indexOf('WARNING') >= 0) {
    output.severity = 'WARNING'
} else if (allSeverities.indexOf('NOTICE') >= 0) {
    output.severity = 'NOTICE'
} else if (allSeverities.indexOf('INFO') >= 0) {
    output.severity = 'INFO'
}

console.log(JSON.stringify(output));

let outputData = JSON.stringify(output);
fs.writeFileSync('rdf_' + filepath, outputData);
