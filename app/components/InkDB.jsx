var React = require("react");
var request = require("superagent");
var chroma = require("chroma-js");


var ViewSelector = require("./ViewSelector.jsx");
var InkListing = require("./InkListing.jsx");
var InkCloud = require("./InkCloud.jsx");


var InkDB = React.createClass({

  getInitialState: function() {
    return {
      currentEntry: {},
      inks: {all:[], darks: [], neutrals: [], colors: []},
      mode: "grid"
    };
  },

  componentDidMount: function() {
    request.get("data.json").end(this.processInks);
  },

  processInks: function(err, data) {
    data = JSON.parse(data.text);
    var inks = [],
        darks = [],
        neutrals = [],
        colors = [];
    Object.keys(data).forEach(function(k) {
      var entry = data[k],
          H = entry.H,
          S = entry.S,
          L = entry.L;

      (function(e) {
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
      }(entry));

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
  },

  render: function() {

    var viewer = (
      <ViewSelector ref="selector" mode={this.state.mode} changeViewMode={this.switchMode} />
    );

    var linkback = (<div className="Pomax">
      By <a href="http://twitter.com/TheRealPomax">Pomax</a>,
      code <a href="http://github.com/Pomax/inkdb.org">here</a>
    </div>);

    var props = {
      inks: this.state.inks,
      inkClicked: this.inkClicked,
      switchMode: this.switchMode
    };

    var maincontent;

    switch(this.state.mode) {
      case "cloud":
        maincontent = <InkCloud {...props} />;
        break;
      case "grid":
      default:
        maincontent = <InkListing {...props} />;
    }

    return (<div>
      {linkback}
      {viewer}
      {maincontent}
    </div>);
  },

  switchMode: function(mode) {
    this.setState({
      mode: mode
    }, function() {
      this.refs.selector.setMode(mode);
    })
  },

  setCurrentEntry: function(entry) {
    this.state.currentEntry.selected = false;
    entry.selected = true;
    this.setState({
      currentEntry: entry
    });
  },

  inkClicked: function(entry) {
    if(this.state.mode === "cloud" && entry.selected) {
      return this.switchMode("grid");
    }
    var ref = chroma(entry.r, entry.g, entry.b, 'rgb');
    var inks = this.state.inks.all;
    inks.forEach(function(entry) {
      var local = chroma(entry.r, entry.g, entry.b, 'rgb');
      var rc = ref.lab();
      var lc = local.lab();
      var distance = Math.sqrt(
        Math.pow(rc[0]-lc[0], 2) +
        Math.pow(rc[1]-lc[1], 2) +
        Math.pow(rc[2]-lc[2], 2)
      );
      entry.distance = distance;
      entry.angle = Math.PI * (ref.hsl()[0] - local.hsl()[0])/180;
    });
    this.switchMode("cloud");
    this.setCurrentEntry(entry);
  },

});

module.exports = InkDB;
