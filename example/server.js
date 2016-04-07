var zetta = require('zetta');
var Light = require('../index');

zetta()
  .use(Light, 'Porch Light')
  .use(Light, 'Bedroom Light')
  .link('http://dev.zettaapi.org')
  .listen(1337);
