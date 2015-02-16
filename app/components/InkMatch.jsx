var React = require("react");
var Dropzone = require("react-dropzone");
var inkmatch = require("../lib/inkmatch");
var ImageEditor = require("./ImageEditor.jsx");

var InkMatch = React.createClass({

  getInitialState: function() {
    return {
      status: "Drop an image here.",
      matches: []
    };
  },

  render: function() {
    var matches = this.state.matches.map(entry => {
      var style = {
        backgroundColor: "rgb("+entry.r+","+entry.g+","+entry.b+")"
      };
      return <li className="match" onClick={this.inkClicked(entry)}>
        <span className="color" style={style} />
        <span>{entry.company + " " + entry.inkname + " (d:" + (""+entry.distance).slice(0,5) + ")"}</span>
      </li>;
    });

    return (
      <div className="inkmatch">
        <header>
          <h1>Drag-and-drop a file to start color-matching</h1>
        </header>
        <div className="matching">
          <Dropzone className="dropzone" onDrop={this.fileHandler}>{this.state.status}</Dropzone>
          <ImageEditor className="editor" ref="editor" listMatches={this.listMatches} />
          <ul className="matches">{ matches }</ul>
        </div>
      </div>
    );
  },

  inkClicked: function(entry) {
    var self = this;
    return function (evt) {
      self.props.inkClicked(entry);
    };
  },

  listMatches: function(color) {
    this.props.alignInks(color);
    this.props.inks.all.sort(function(a,b) {
      a = a.distance;
      b = b.distance;
      return a - b;
    });
    this.setState({
      matches: this.props.inks.all.slice(0,10)
    });
  },

  fileHandler: function(files) {
    this.setState({
      status: "Uploading...",
      datauri: ""
    }, function () {
      var self = this;
      var file = files[0];
      var reader = new FileReader();
      reader.addEventListener("loadend", function(e) {
        self.setState({
          status: "Processing..."
        });
        inkmatch(this.result, self.setInkMatch);
      });
      setTimeout(function() { reader.readAsDataURL(file); },250);
    });
  },

  setInkMatch: function(err, result) {
    this.setState({
      status: "Pick a found color, or try with another image.",
    }, function() {
      this.refs.editor.setData(result);
    });
  }

});

module.exports = InkMatch;
