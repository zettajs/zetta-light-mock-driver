var zetta = require('zetta');
var Light = require('../index');
var style = require('./apps/style');

zetta()
  .use(Light)
  .use(style)
  .listen(1337);
