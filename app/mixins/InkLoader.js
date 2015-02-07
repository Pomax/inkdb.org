var request = require("superagent");

var InkLoader = {

  componentDidMount: function() {
    request.get("data.json").end(this.processInks);
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
          H = entry.H,
          S = entry.S,
          L = entry.L;
      enrich(entry);
      if(L < 0.08) { darks.push(entry); }
      else if(L < 0.15 && S < 0.3) { darks.push(entry); }
      else if(S < 0.09 || (S < 0.2 && L < 0.25)) { neutrals.push(entry); }
      else { colors.push(entry); }
      inks.push(entry);
    });

    this.setState({
      inks: {
        all: inks,
        darks: darks,
        neutrals: neutrals,
        colors: colors
      }
    });
  }

};

module.exports = InkLoader;
