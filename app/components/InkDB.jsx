var React = require("react");
var chroma = require("chroma-js");

var ViewSelector = require("./ViewSelector.jsx");
var InkListing = require("./InkListing.jsx");
var InkCloud = require("./InkCloud.jsx");
var InkMatch = require("./InkMatch.jsx");

var InkDB = React.createClass({

  mixins: [
    require("../mixins/InkLoader")
  ],

  getInitialState: function() {
    return {
      currentEntry: {},
      inks: {all:[], darks: [], neutrals: [], colors: []},
      mode: "grid"
    };
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
      alignInks: this.alignInks,
      switchMode: this.switchMode
    };

    var maincontent;

    switch(this.state.mode) {
      case "cloud":
        maincontent = <InkCloud {...props} />;
        break;
      case "match":
        maincontent = <InkMatch {...props} />;
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

  switchMode: function(mode, callback) {
    this.setState({
      mode: mode
    }, function() {
      this.refs.selector.setMode(mode);
      if(callback) callback();
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
    var ref = chroma(entry.r, entry.g, entry.b, "rgb");
    this.alignInks(ref);
    var self = this;
    this.switchMode("cloud", function() {
      self.setCurrentEntry(entry);
    });
  },

  alignInks: function(ref) {
    var inks = this.state.inks.all;
    inks.forEach(function(entry) {
      var local = chroma(entry.r, entry.g, entry.b, "rgb");
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
  }

});

module.exports = InkDB;
