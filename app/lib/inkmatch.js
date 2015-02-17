var RGBQuant = require("rgbquant");
var JpegImage = require("./jpg.js");
var chroma = require("chroma-js");

var opts = {
  colors: 10,
  boxSize: [200,200],
  initColors: 256
};

module.exports = function inkmatch(dataURI, callback) {

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

  function analyse(dataURI) {
    var jpeg = new JpegImage();
    jpeg.onload = function() {
      var w = 500;
      var h = (jpeg.height * (500/jpeg.width))|0;
      var jpegdata = jpeg.getData(w,h);
      var clamped = new Uint8ClampedArray(w*h*4);
      for(var i=0, l=jpegdata.length/3; i<l; i++) {
        clamped[4*i] = jpegdata[3*i];
        clamped[4*i+1] = jpegdata[3*i+1];
        clamped[4*i+2] = jpegdata[3*i+2];
        clamped[4*i+3] = 255;
      }
      setTimeout(function() { performAnalysis(clamped,w,h); },250);
    };
    jpeg.load(dataURI);
  }

  analyse(dataURI);
};
