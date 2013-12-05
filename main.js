'use strict';

// DEPENDENCES =================================================================

// GLOBALS =====================================================================

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

/**
 * Runs a function and times it
 * @param {function} f Function to run
 * @param {number} times How many times to run f
 **/
var run = function (f, times) {
	times = times || 1;
	var time0 = process.hrtime();
	for (var i = times; i > 0; i--) {
		f();
	}
	var time1 = process.hrtime();
	return timeDiff(time0, time1);
};

/**
 * Runs two functions and compare the time spent
 * @param {object} obj Map of functions to compare
 **/
var compare = function (obj, times) {

	var f, min, code = {};
	for (f in obj) {
		code[f] = obj[f].toString().replace(/\n+/g, '').replace(/\t+/g, ' ');
		obj[f].timeSpent = run(obj[f], times);
		if (!min || min.timeSpent > obj[f].timeSpent) {
			min = obj[f];
		}
	}
	var time = {}, relative;
	for (f in obj) {
		relative = timeDiff(min.timeSpent, obj[f].timeSpent);
		time[f] = {
			source: code[f],
			raw: obj[f].timeSpent,
			duration: time2string(obj[f].timeSpent),
		};
		if (relative[0] || relative[1]) {
			time[f].relative = '+ ' + time2string(relative);
			if (relative[0]) {
				time[f].loss = (relative[0] * 100) / min.timeSpent[0];
			} else {
				time[f].loss = (relative[1] * 100) / min.timeSpent[1];
			}
			time[f].loss = time[f].loss.toFixed(2) + '%';
		}
	}

	// Sort json
	var result = [];
	for (f in time) {
		time[f].name = f;
		result.push(time[f]);
	}
	result.sort(function(a, b) {
		return a.raw.join('') > b.raw.join('');
	});
	
	return result;
};

// EXPORTS =====================================================================

exports.run = run;
exports.compare = compare;
exports.time2json = time2json;
exports.time2string = time2string;
