var request = require("superagent");
var chroma = require("chroma-js");
var globalinks = false;

var InkLoader = {

  getInitialState: function() {
    return {
      currentEntry: {},
      inks: {
        all:[],
        darks: [],
        neutrals: [],
        colors: []
      }
    };
  },

  componentDidMount: function() {
    if(globalinks) { this.setState({ inks: globalinks }); }
    else { request.get("data.json").end(this.processInks); }
  },

  processInks: function(err, data) {
    data = JSON.parse(data.text);
    var inks = [],
        darks = [],
        neutrals = [],
        colors = [];

    var enrich = function(e) {
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
  },

  setCurrentEntry: function(entry) {
    this.state.currentEntry.selected = false;
    entry.selected = true;
    this.setState({ currentEntry: entry });
  },

  alignInks: function(reference) {
    var inks = this.state.inks.all;
    inks.forEach(function(entry) {
      var local = chroma(entry.r, entry.g, entry.b, "rgb");
      var rc = reference.lab();
      var lc = local.lab();
      var distance = Math.sqrt(
        Math.pow(rc[0]-lc[0], 2) +
        Math.pow(rc[1]-lc[1], 2) +
        Math.pow(rc[2]-lc[2], 2)
      );
      entry.distance = distance;
      entry.angle = Math.PI * (reference.hsl()[0] - local.hsl()[0])/180;
    });
  }

};

module.exports = InkLoader;
