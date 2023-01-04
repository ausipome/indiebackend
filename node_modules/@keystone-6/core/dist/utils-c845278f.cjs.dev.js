'use strict';

/**
 * Converts the first character of a string to uppercase.
 * @param {String} str The string to convert.
 * @returns The new string
 */
const upcase = str => str.slice(0, 1).toUpperCase() + str.slice(1);

/**
 * Turns a passed in string into
 * a human readable label
 * @param {String} str The string to convert.
 * @returns The new string
 */
const humanize = str => {
  return str.replace(/([a-z])([A-Z]+)/g, '$1 $2').split(/\s|_|\-/).filter(i => i).map(upcase).join(' ');
};

exports.humanize = humanize;
