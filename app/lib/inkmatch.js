var RGBQuant = require("rgbquant");
var chroma = require("chroma-js");

var opts = {
  colors: 10,
  boxSize: [200,200],
  initColors: 256
};

module.exports = function inkmatch(data, w, h, callback) {

  function performAnalysis(data, width, height) {
    data = data.data ? data.data : data;
    var quantizer = new RGBQuant(opts);
    quantizer.sample(data, width);
    var pal = quantizer.palette(true, true).map(function(rgb) {
      return chroma(rgb[0], rgb[1], rgb[2], "rgb");
    });
    callback(false, {
      pal: pal,
      data: data,
      crushed: quantizer.reduce(data),
      width: width,
      height: height
    });
  }

  setTimeout(function() { performAnalysis(data, w, h); }, 25);
};
