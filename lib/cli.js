#!/usr/bin/env node

const waller = require('./index');
const args = process.argv.slice(2);
const hasMessageArgument = args.indexOf('-m') > -1;
const message = hasMessageArgument ? args[args.indexOf('-m') + 1] : null;
const rows = process.stdout.rows;
const columns = process.stdout.columns;

console.log(waller(rows, columns, message));