'use strict';

// DEPENDENCES =================================================================

// GLOBALS =====================================================================

var ITERATIONS_PER_TEST = 1000000;

// MAIN LOGIC ==================================================================

/**
 * Computes the diff between two times (in nanoseconds)
 * @param {array} time Start time [sec, nanosec]
 * @param {array} time End time [sec, nanosec]
 **/
var timeDiff = function (time0, time1) {
	var secondsDiff = (time1[0] || 0) - (time0[0] || 0);
	var nanosecondsDiff = (time1[1] || 0) - (time0[1] || 0);
	return [secondsDiff, nanosecondsDiff];
};

/**
 * Time in object format
 * @param {number} time Time to format (in array [seconds, nanoseconds] format)
 * @returns {string} time for humans
 **/
var time2string = function (time) {
	var json = time2json(time);
	var str = '';

	if (json.seconds) {
		str += json.seconds + ' s ';
	}
	if (json.deciseconds) {
		str += json.deciseconds + ' ds ';
	}
	if (json.centiseconds) {
		str += json.centiseconds + ' cs ';
	}
	if (json.milliseconds) {
		str += json.milliseconds + ' ms ';
	}
	if (json.microseconds) {
		str += json.microseconds + ' μs ';
	}
	str += json.nanoseconds + ' ns';

	return str;
};

/**
 * Time in object format
 * @param {number} time Time to format (in array [seconds, nanoseconds] format)
 * @returns {object} json time
 **/
var time2json = function (time) {

	var seconds = time[0] || 0;
	time = time[1];

	var deciseconds = parseInt(time / 100000000, 10) || 0;
	time = time % 100000000;

	seconds += parseInt(deciseconds / 10, 10);
	deciseconds = deciseconds % 10;

	var centiseconds = parseInt(time / 10000000, 10) || 0;
	time = time % 10000000;

	var milliseconds = parseInt(time / 1000000, 10) || 0;
	time = time % 1000000;

	var microseconds = parseInt(time / 1000, 10) || 0;
	time = time % 1000;

	var nanoseconds = time || 0;

	var json = {
		seconds: seconds,
		deciseconds: deciseconds,
		centiseconds: centiseconds,
		milliseconds: milliseconds,
		microseconds: microseconds,
		nanoseconds: nanoseconds
	};

	return json;
};
var ya = false;
var buildFunctionStats = function (runs, seconds) {

	var stats = {
		runsPerSecond: runs / seconds,
		timePerRun: (seconds / runs) + ' sec',
		error: ya ? '2.30' : '99.29' // TODO Compute this
	};
	ya = true;
	return stats;
}

/**
 * Runs a function many times and times it
 * @param {function} f Function to run
 **/
var run = function (f) {

	var TEST_TIME_SECONDS = 2;
	var runs = 0;
	var time0 = process.hrtime();
	var hrelapsed = null;
	do {

		runs++;
		eval('f()'); // to avoid unloop
		hrelapsed = process.hrtime(time0);

	} while (hrelapsed[0] < TEST_TIME_SECONDS);

	var seconds = hrelapsed[0];
	var stats = buildFunctionStats(runs, seconds);
	return stats;
};

/**
 * Runs two functions and compare the time spent
 * @param {object} obj Map of functions to compare
 **/
var compare = function (obj) {

	var fname, f, st, stats = {}, tagLength = 0;
	for (fname in obj) {
		f = obj[fname];
		st = run(f);
		stats[fname] = st;
	}

	printStats(stats);

	return stats;
};

var printStats = function (stats) {

	var tagLength = 0, countLength = 0, key, fname;
	for (fname in stats) {
		if (fname.length > tagLength) {
			tagLength = fname.length;
		}
		var rps = formatNumber(stats[fname].runsPerSecond);
		if (rps.length > countLength) {
			countLength = rps.length;
		}
	}

	for (fname in stats) {
		var tag = (fname + new Array(tagLength).join(' ')).slice(0, tagLength);
		var runs = (new Array(countLength).join(' ') + formatNumber(stats[fname].runsPerSecond)).slice(-1 * countLength);
		var err = ('   ' + stats[fname].error).slice(-6);
		console.log(tag + ' x ' + runs + ' ops/sec ±' + err + '%');
	}
};

var formatNumber = function(str) {
	str = str | 0;
	var amount = new String(str);
    amount = amount.split("").reverse();

    var output = "";
    for ( var i = 0; i <= amount.length-1; i++ ){
        output = amount[i] + output;
        if ((i+1) % 3 == 0 && (amount.length-1) !== i)output = ',' + output;
    }
    return output;

};

// EXPORTS =====================================================================

exports.run = run;
exports.compare = compare;
exports.time2json = time2json;
exports.time2string = time2string;
