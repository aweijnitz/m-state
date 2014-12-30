# A Turing Machine Implementation For Node.js

## Installation

## Usage

## Running tests

    npm test

## Implementation notes
### Compiled state machine (Busy Beaver)

    'A-0': [ '1', 'R', 'B' ],
    'A-1': [ '1', 'L', 'C' ],
    'B-0': [ '1', 'L', 'A' ],
    'B-1': [ '1', 'R', 'B' ],
    'C-0': [ '1', 'L', 'B' ],
    'C-1': [ '1', 'N', 'H' ]
