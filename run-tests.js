'use strict';

var microbenchmark = require('./main.js');

// time2json tests

(function () {

	var tests = [
		{
			nanoseconds: 0,
			expected: {
				seconds: 0,
				deciseconds: 0,
				centiseconds: 0,
				milliseconds: 0,
				microseconds: 0,
				nanoseconds: 0
			}
		}, {
			nanoseconds: 100,
			expected: {
				seconds: 0,
				deciseconds: 0,
				centiseconds: 0,
				milliseconds: 0,
				microseconds: 0,
				nanoseconds: 100
			}
		}, {
			nanoseconds: 1000,
			expected: {
				seconds: 0,
				deciseconds: 0,
				centiseconds: 0,
				milliseconds: 0,
				microseconds: 1,
				nanoseconds: 0
			}
		}, {
			nanoseconds: 1000000,
			expected: {
				seconds: 0,
				deciseconds: 0,
				centiseconds: 0,
				milliseconds: 1,
				microseconds: 0,
				nanoseconds: 0
			}
		}, {
			nanoseconds: 10000000,
			expected: {
				seconds: 0,
				deciseconds: 0,
				centiseconds: 1,
				milliseconds: 0,
				microseconds: 0,
				nanoseconds: 0
			}
		}, {
			nanoseconds: 10009008,
			expected: {
				seconds: 0,
				deciseconds: 0,
				centiseconds: 1,
				milliseconds: 0,
				microseconds: 9,
				nanoseconds: 8
			}
		}, {
			nanoseconds: 7417339008,
			expected: {
				seconds: 7,
				deciseconds: 4,
				centiseconds: 1,
				milliseconds: 7,
				microseconds: 339,
				nanoseconds: 8
			}
		}, {
			nanoseconds: 700417009000,
			expected: {
				seconds: 700,
				deciseconds: 4,
				centiseconds: 1,
				milliseconds: 7,
				microseconds: 9,
				nanoseconds: 0
			}
		}
	];

	tests.forEach(function (t, i) {
		var got = JSON.stringify(microbenchmark.time2json(t.nanoseconds));
		var expected = JSON.stringify(t.expected);
		console.assert(got === expected, 'time2json test failed:\n' + 'Expected = ' + expected + '\nGot = ' + got + '\n');
		console.log('- Test ' + (i + 1) + '/' + tests.length + ' passed ✓');
		console.log(microbenchmark.time2string(t.nanoseconds));
	});
}());
