var Device = require('zetta-device');
var util = require('util');

var Light = module.exports = function() {
  Device.call(this);
};
util.inherits(Light, Device);

Light.prototype.init = function(config) {
  config
    .name('Light')
    .type('light')
    .state('off')
    .when('on', {allow: ['turn-off']})
    .when('off', {allow: ['turn-on']})
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff);
    
  var self = this;
  setInterval(function() {
    self.state == 'on' ? self.call('turn-off') : self.call('turn-on');
  }, 1000);
};

Light.prototype.turnOn = function (cb) {
  this.state = 'on';
  cb();
}

Light.prototype.turnOff = function (cb) {
  this.state = 'off';
  cb();
}