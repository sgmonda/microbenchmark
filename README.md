Microbenchmarks for NodeJS

#### What is a microbenchmark?

A microbenchmark is a tiny program or routine that attempts to measure the performance of a "small" bit of code. These tests are typically in the sub-millisecond range. The code being tested usually performs no I/O, or else is a test of some single, specific I/O task.

## Installation

## Usage

This module has been written to compare tiny functions performance. For instance, if we want to compare the peformance of some ways to convert a string to an integer number, we can write the following:

````
var microbenchmark = require('microbenchmark');
var bench = microbenchmark.compare({
	'parseInt': function() {
		return parseInt('23.4', 10);
	},
	'bitwise': function() {
		return '23.45' | 0;
	},
	'Math.floor': function() {
		return Math.floor('23.44');
	}
});
console.log(bench);
````

Alternatively we can run every function to compare more than once, adding a second parameter to `compare()` function. The following will run 1000 times every function.

````
var bench = microbenchmark.compare({...}, 1000);
````