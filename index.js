var Device = require('zetta-device');
var util = require('util');
var extend = require('node.extend');
var Color = require('color');

var TIMEOUT = 1000;
var IMAGE_URL_ROOT = 'http://www.zettaapi.org/icons/';
var IMAGE_EXTENSION = '.png';
var DEVICE_TYPE = 'light';

var Light = module.exports = function(suggestedName) {
  Device.call(this);
  this.color = [0xFF, 0xFF, 0xFF];
  this.brightness = 50;
  this.blink = false;
  this.style = {properties: {stateImage: {}}};
  this._interval = null;
  this._suggestedName = suggestedName;
};
util.inherits(Light, Device);

Light.prototype.init = function(config) {
  config
    .name(this._suggestedName)
    .type(DEVICE_TYPE)
    .state('off')
    .when('on', {allow: ['turn-off', 'set-color', 'set-brightness', 'set-blinker']})
    .when('off', {allow: ['turn-on', 'set-color', 'set-brightness', 'set-blinker']})
    .when('turning-on', {allow: []})
    .when('turning-off', {allow: []})
    .map('set-color', this.setColor, [{ type:'color', name: 'color' }])
    .map('set-brightness', this.setBrightness, [{ type: 'range', name: 'brightness', value: this.brightness, min: 0, max: 100}])
    .map('set-blinker', this.setBlinker, [{ type: 'checkbox', name: 'blink', value: this.blink }])
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff);

  this.setBlinker(this.blink, function(){});
  this._setStateImageURL('off');
};

Light.prototype.turnOn = function (cb) {
  this._performLongOperation('turning-on', 'on', TIMEOUT, cb);
}

Light.prototype.turnOff = function (cb) {
  this._performLongOperation('turning-off', 'off', TIMEOUT, cb);
}

Light.prototype.setColor = function (color, cb) {
  var colorArray = Color(color).rgbArray();
  this.style.properties.stateImage.foregroundColor = {
    hex: color,
    decimal: {red: colorArray[0], green: colorArray[1], blue: colorArray[2]}
  }
  cb();
}

Light.prototype.setBrightness = function (brightness, cb) {
  this.brightness = brightness;
  cb();
}

Light.prototype.setBlinker = function(blink, cb) {
  this.blink = (String(blink) === 'true');
  if (this.blink === true) {
    var self = this;
    this._interval = setInterval(function(){
      self._toggleLight();
    }, 5000);
  } else {
    clearInterval(this._interval);
  }
  cb();
}

Light.prototype._toggleLight = function(blink, cb) {
  if (this.state === 'on') {
    this.call('turn-off');
  } else {
    this.call('turn-on');
  }
}

Light.prototype._performLongOperation = function(initState, finalState, delay, cb) {
  this.state = initState;
  this._setStateImageURL(initState);
  cb();

  var self = this;
  setTimeout(function(){
    self.state = finalState;
    self._setStateImageURL(finalState);
    cb();
  }, delay);
}

Light.prototype._setStateImageURL = function(state) {
  this.style.properties.stateImage.url = IMAGE_URL_ROOT + DEVICE_TYPE + '-' + state + IMAGE_EXTENSION;
  this.style.properties.stateImage.tintMode = 'template';
}
