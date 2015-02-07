var RGBQuant = require("rgbquant");
var JpegImage = require("./jpg.js");

module.exports = function inkmatch(dataURI, callback) {

  function performAnalysis(cvs) {
    var opts = {
      colors: 10,
      boxSize: [200,200],
      initColors: 256
    };
    var quantizer = new RGBQuant(opts);
    var img = new Image();
    img.onload = function() {
      quantizer.sample(img);
      var threshold = 150;
      var neutral = 15;
      var pal = quantizer.palette(true, true).filter(function(rgb) {
        if (rgb[0]<threshold && rgb[1]<threshold && rgb[2]<threshold) return true;
        var d1 = Math.abs(rgb[0] - rgb[1]);
        var d2 = Math.abs(rgb[1] - rgb[2]);
        var d3 = Math.abs(rgb[2] - rgb[0]);
        return !(d1<neutral && d2<neutral && d3<neutral);
      });
      callback(pal);
    };
    img.src = cvs.toDataURL("image/png");
  }

  function analyse(dataURI) {
    var jpeg = new JpegImage();
    jpeg.onload = function() {
      var cvs = document.createElement("canvas");
      cvs.width = jpeg.width;
      cvs.height = jpeg.height;
      var ctx = cvs.getContext("2d");
      var imageData = ctx.getImageData(0,0,jpeg.width,jpeg.height);
      jpeg.copyToImageData(imageData);
      ctx.putImageData(imageData, 0, 0);
      performAnalysis(cvs);
    };
    jpeg.load(dataURI);
  }

  analyse(dataURI);
};
