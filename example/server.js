var zetta = require('zetta');
var Light = require('../index');

zetta()
  .use(Light)
  .link('http://dev.zettaapi.org')
  .listen(1337);
