const { Waller } = require('./waller');

function init(rows, columns, message) {
  const waller = new Waller(rows, columns, message);
  return waller.render();
}

module.exports = init;