var request = require("superagent");
var globalinks = false;

var InkLoader = {

  componentDidMount: function() {
    if(globalinks) { this.setState({ inks: globalinks }); }
    else { request.get("data.json").end(this.processInks); }
  },

  processInks: function(err, data) {
    data = JSON.parse(data.text);
    var inks = [],
        darks = [],
        neutrals = [],
        colors = [],
        enrich = function(e) {
          var r = parseInt(e.r,10);
          var g = parseInt(e.g,10);
          var b = parseInt(e.b,10);
          var i = (r+g+b)/3;
          e.i = i;
          var sr = Math.abs(r-i);
          var sg = Math.abs(g-i);
          var sb = Math.abs(b-i);
          e.spread = {
            max: Math.max(sr,Math.max(sg,sb)),
            min: Math.min(sr,Math.min(sg,sb)),
          };
        };

    Object.keys(data).forEach(function(k) {
      var entry = data[k],
          // H = entry.H,
          S = entry.S,
          L = entry.L;
      enrich(entry);
      if(L < 0.08) {
        entry.darks = true;
        darks.push(entry);
      } else if(L < 0.15 && S < 0.3) {
        entry.darks = true;
        darks.push(entry);
      } else if(S < 0.09 || (S < 0.2 && L < 0.25)) {
        entry.neutrals = true;
        neutrals.push(entry);
      } else {
        entry.colors = true;
        colors.push(entry);
      }
      inks.push(entry);
    });

    globalinks = {
      all: inks,
      darks: darks,
      neutrals: neutrals,
      colors: colors
    };

    this.setState({ inks: globalinks });
  }

};

module.exports = InkLoader;
