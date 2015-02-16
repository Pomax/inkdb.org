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
      var cvs = document.createElement("canvas");
      var w = jpeg.width;
      var h = jpeg.height;
      cvs.width = w;
      cvs.height = h;
      var ctx = cvs.getContext("2d");
      var imageData = ctx.getImageData(0,0,w,h);
      jpeg.copyToImageData(imageData);
      ctx.putImageData(imageData, 0, 0);
      var data = ctx.getImageData(0,0,w,h);
      setTimeout(function() { performAnalysis(data,w,h); },250);
    };
    jpeg.load(dataURI);
  }

  analyse(dataURI);
};
