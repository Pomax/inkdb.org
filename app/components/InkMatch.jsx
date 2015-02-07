var React = require("react");
var Dropzone = require("react-dropzone");
var inkmatch = require("../lib/inkmatch");
var chroma = require("chroma-js");

var InkMatch = React.createClass({

  getInitialState: function() {
    return {
      status: "Drop an image here.",
      pal: [],
      matches: [],
      datauri: ""
    };
  },

  render: function() {
    var self = this;

    var pal = this.state.pal
      .sort(function(a,b) {
        a = chroma(a[0],a[1],a[2],'rgb').hsl()[0];
        b = chroma(b[0],b[1],b[2],'rgb').hsl()[0];
        return a-b;
      }).
      map(function(rgb) {
        var key = rgb.join('');
        rgb = { r: rgb[0], g: rgb[1], b: rgb[2] };
        var style = {
          background: "rgb("+rgb.r+","+rgb.g+","+rgb.b+")"
        };
        var findMatch = function() {
          self.findMatch(rgb);
        };
        return <span className="ink match"
                     style={style}
                     key={key}
                     onClick={findMatch}/>
      });

    var matches = this.state.matches
      .map(function(ink) {
        var clicked = function() {
          self.props.inkClicked(ink);
        };
        var label = ink.company + " " + ink.inkname;
        var style = {
          background: "rgb("+ink.r+","+ink.g+","+ink.b+")"
        };
        return <div className="match row"
                    key={label}
                    onClick={clicked}>
          <span className="ink match" style={style}></span>
          <span>{label} (d: {(""+ink.distance).substring(0,4)})</span>
        </div>;
     });

    return (
      <div className="inkmatch">
        <header>
          <h1>Drag-and-drop a file to start color-matching</h1>
        </header>
        <div className="matching">
          <Dropzone handler={this.fileHandler}>
            { this.state.datauri ? <img src={this.state.datauri}/> : "" }
            <span>{this.state.status}</span>
          </Dropzone>
          { pal.length ? <div className="palette">{pal}</div> : "" }
          { matches.length ? (
            <div className="matches">
              <h2>Current best matches:</h2>
              {matches}
            </div> ) : ""
          }
        </div>
      </div>
    );
  },

  findMatch: function(rgb) {
    var ref = chroma(rgb.r, rgb.g, rgb.b, 'rgb');
    this.props.alignInks(ref);
    this.props.inks.all.sort(function(a,b) {
      a = a.distance;
      b = b.distance;
      return a - b;
    });
    this.setState({
      matches: this.props.inks.all.slice(0,10)
    });
  },

  fileHandler: function(file) {
    var self = this;
    self.setState({
      status: "Uploading...",
      datauri: ""
    });

    // console.log("receiving", {
    //   name: file.name,
    //   type: file.type,
    //   size: file.size
    // });

    var reader = new FileReader();
    reader.addEventListener("loadend", function (e) {
      console.log("done");
      self.setState({ status: "Processing..." });
      data = this.result;
      inkmatch(data, function(result) {
        self.setState({
          status: "Pick a found color, or try with another image.",
          pal: result,
          datauri: data
        });
      });
    });
    reader.readAsDataURL(file);
  }

});

module.exports = InkMatch;
