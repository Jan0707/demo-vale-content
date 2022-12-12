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

let rawdata = fs.readFileSync(filepath);
let inputData = JSON.parse(rawdata);
console.log(inputData);

// TODO: Read JSON into intermediary value object
// TODO: Map intermediary value object to RDF

// TODO: Write out RDF to json
// let data = JSON.stringify(student);
//fs.writeFileSync('student-2.json', data);
