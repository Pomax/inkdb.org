var React = require("react");
var Dropzone = require("react-dropzone");
var inkmatch = require("../lib/inkmatch");
var ImageEditor = require("./ImageEditor.jsx");

var matchTypes = [
  "perfect",
  "very close",
  "close",
  "decent",
  "distant",
  "poor"
];

var InkMatch = React.createClass({

  getInitialState: function() {
    return {
      status: "Click here to select an image, or drag-and-drop an image here.",
      matches: []
    };
  },

  render: function() {
    return (
      <div className="inkmatch">
        <header>
          <h1>Find an ink based on an image or photo</h1>
        </header>
        <div className="matching">
          <Dropzone className="dropzone" onDrop={this.fileHandler}>{this.state.status}</Dropzone>
          <ImageEditor className="editor"
                       ref="editor"
                       listMatches={this.listMatches}
                       analysisStarted={this.analysisStarted}
                       analysisCompleted={this.analysisCompleted}/>
          { this.matchListing() }
        </div>
      </div>
    );
  },

  analysisStarted: function() {
    this.setState({
      status: "Analysing image colours..."
    });
  },

  analysisCompleted: function(pal) {
    this.setState({
      status: pal.length + " results found. Click any to see them in more detail."
    });
  },

  matchListing: function() {
    var matches = this.formMatchList();
    var matchTypeStrings = matchTypes.map(type => {
      return <span className="matchtype">{type}</span>;
    });

    if (matches.length === 0) {
      return "";
    }

    return (<div>
      <ul className="matches">{ matches }</ul>
      <p className="matchlegend">match types in descending order: {matchTypeStrings}.</p>
    </div>);
  },

  formMatchList: function() {
    return this.state.matches.map((entry,idx) => {
      var style = {
        backgroundColor: "rgb("+entry.r+","+entry.g+","+entry.b+")"
      };
      var key = [entry.r,entry.g,entry.b].join("") + idx;

      var matchType = (function(d) {
        if(d===0) { return matchTypes[0]; }
        else if(d<2)   { return matchTypes[1]; }
        else if(d<6)   { return matchTypes[2]; }
        else if(d<12)  { return matchTypes[3]; }
        else if(d<20)  { return matchTypes[4]; }
        else           { return matchTypes[5]; }
      }(entry.distance));

      matchType = " (" + matchType + " match)"; // - {(""+entry.distance).substring(0,5)})

      return <li className="match" onClick={this.inkClicked(entry)} key={key}>
        <span className="color" style={style} />
        <span>{entry.company + " " + entry.inkname}</span>
        <span>{matchType}</span>
      </li>;
    });
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
    this.refs.editor.reset();
    this.setState(
      {
        status: "Uploading...",
        datauri: "",
        matches: []
      },
      function () {
        var self = this;
        var file = files[0];
        var reader = new FileReader();
        reader.addEventListener("loadend", function(e) {
          self.setState({
            status: "Processing..."
          });
          inkmatch(this.result, self.setInkMatch);
        });
        setTimeout(function() { reader.readAsDataURL(file); },50);
      }
    );
  },

  setInkMatch: function(err, result) {
    this.setState({
      status: "Adjust the white balance as needed, then click 'analyse'.",
    }, function() {
      this.refs.editor.setData(result);
    });
  }

});

module.exports = InkMatch;
