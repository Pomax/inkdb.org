var RGBQuant = require("rgbquant");
var JpegImage = require("./jpg.js");
var temperature = require("../lib/temperature");

var opts = {
  colors: 10,
  boxSize: [200,200],
  initColors: 256
};

module.exports = function inkmatch(dataURI, Kelvin, callback) {
  if(typeof Kelvin === "function") {
    callback = Kelvin;
    Kelvin = false;
  }

  function performAnalysis(data, width, height) {
    data = data.data ? data.data : data;

    if (Kelvin) {
      var temp = temperature(Kelvin);
      for(var i=0, l=data.length; i<l; i+=4) {
        data[i]   = (data[i]   + temp[0])/2;
        data[i+1] = (data[i+1] + temp[1])/2;
        data[i+2] = (data[i+2] + temp[2])/2;
        data[i+3] = 255;
      }
    }

    var quantizer = new RGBQuant(opts);
    quantizer.sample(data, width);
    callback(false, {
      pal: quantizer.palette(true, true),
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
