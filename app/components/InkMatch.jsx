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
      datauri: "",
      showOriginal: true
    };
  },

  render: function() {
    var self = this;

    var pal = this.state.pal
      .sort(function(a,b) {
        a = chroma(a[0],a[1],a[2],"rgb").hsl()[0];
        b = chroma(b[0],b[1],b[2],"rgb").hsl()[0];
        return a-b;
      }).
      map(function(rgb) {
        var key = rgb.join("");
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
                     onClick={findMatch}/>;
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

    var src = this.state.showOriginal ? this.state.datauri : this.state.crushed;

    return (
      <div className="inkmatch">
        <header>
          <h1>Drag-and-drop a file to start color-matching</h1>
        </header>
        <div className="matching">
          <Dropzone className="dropzone" onDrop={this.fileHandler}>
            { this.state.datauri ? (
              <img src={src}
                   onMouseOver={this.showCrushed}
                   onMouseOut={this.showOriginal} />
             ): "" }
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

  showOriginal: function() {
    this.setState({
      showOriginal: true
    });
  },

  showCrushed: function() {
    this.setState({
      showOriginal: false
    });
  },

  findMatch: function(rgb) {
    var ref = chroma(rgb.r, rgb.g, rgb.b, "rgb");
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

  fileHandler: function(files) {
    // console.log("receiving", { name: file.name, type: file.type, size: file.size });
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
      pal: result.pal,
      datauri: this.toImageSource(result.data, result.width, result.height),
      crushed: this.toImageSource(result.crushed, result.width, result.height)
    }, function() { console.log(); });
  },

  toImageSource: function(data, w, h) {
    var cvs = document.createElement("canvas");
    cvs.width = w;
    cvs.height = h;
    var ctx = cvs.getContext("2d");
    var imgdata = ctx.getImageData(0,0,w,h);
    for(var i=data.length-1; i>=0; i--) { imgdata.data[i] = data[i]; }
    ctx.putImageData(imgdata,0,0);
    return cvs.toDataURL("image/png");
  }

});

module.exports = InkMatch;
