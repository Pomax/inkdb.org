var React = require("react");
var chroma = require("chroma-js");

var ViewSelector = require("./ViewSelector.jsx");
var InkListing = require("./InkListing.jsx");
var InkCloud = require("./InkCloud.jsx");
var InkMatch = require("./InkMatch.jsx");

var modes = [
  "grid",
  "cloud",
  "match",
  "submit"
];

var InkDB = React.createClass({

  mixins: [
    require("../mixins/InkLoader")
  ],

  getInitialState: function() {
    return {
      mode: modes[0]
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
      if(callback) {
        callback();
      }
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
  }

});

module.exports = InkDB;
