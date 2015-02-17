var React = require("react");
var temperature = require("../lib/temperature");
var inkmatch = require("../lib/inkmatch");

var ImageEditor = React.createClass({

  getInitialState: function() {
    return {
      colorsonly: false,
      data: false,
      pal: [],
      processing: false,
      temperature: 6500
    };
  },

  reset: function() {
    var cvs = this.refs.canvas.getDOMNode();
    cvs.width = 0;
    cvs.height = 0;
    this.setState(this.getInitialState());
  },

  render: function() {
    if (!this.state.data) {
      return <div className="imageeditor">
        <canvas ref="canvas"></canvas>
      </div>;
    }

    else if (!this.state.processing && this.state.pal.length === 0) {
      var temperatures = this.formTemperatureGuage();
      return <div className="imageeditor">
        <canvas ref="canvas"></canvas>
        <div className="temperatures">{temperatures}</div>
        <button onClick={this.analyse}>Analyse</button>
      </div>;
    }

    else {
      var pal = this.formPalette();
      return <div className="imageeditor">
        <canvas ref="canvas"></canvas>
        <div className="palette">{pal}</div>
      </div>;
    }
  },

  formPalette: function() {
    return this.state.pal.filter(color => {
      if(this.state.colorsonly) {
        var hsl = color.hsl(), s = hsl[1], l = hsl[2];
        return s > 0.15 && l > 0.3;
      }
      return true;
    }).map((v,idx) => {
      var hsl = v.hsl();
      var style = {
        backgroundColor: "hsl("+(hsl[0]|0)+","+((100*hsl[1])|0)+"%,"+((100*hsl[2])|0)+"%)"
      };
      var key = hsl.join("") + idx;
      return <button className="pal" style={style} onClick={this.listMatches(v)} key={key} />;
    });
  },

  formTemperatureGuage: function() {
    var temperatures = [];
    for(var i=4200; i<9200; i+=50) { temperatures.push(i); }
    return temperatures.map(T => {
      var temp = temperature(T);
      var style = {
        backgroundColor: "rgb("+(temp[0]|0)+","+(temp[1]|0)+","+(temp[2]|0)+")",
      };
      var className = "temperature";
      if(T === this.state.temperature) {
        className += " selected";
      }
      return <div className={className} style={style} onClick={this.changeTemperature(T)} title={T} key={T}/>;
    });
  },

  listMatches: function(color) {
    var self = this;
    return function (evt) {
      self.props.listMatches(color);
    };
  },

  analyse: function() {
    var self = this;
    var cvs = this.refs.canvas.getDOMNode();
    this.setState({ processing: true }, function() {
      this.props.analysisStarted();
      var w = 500;
      var h = cvs.height;
      var ctx = cvs.getContext("2d");
      var imgData = ctx.getImageData(0,0,w,h);
      inkmatch(imgData.data, w, h, function(err, result) {
        self.setState({
          pal: result.pal,
          processing: false
        });
        self.props.analysisCompleted(result.pal);
      });
    });
  },

  changeTemperature: function(T) {
    return function(evt) {
      this.setState({ temperature: T }, function() {
        var cvs = this.refs.canvas.getDOMNode();
        cvs.width = 500;
        cvs.height = this.state.height * 500/this.state.width;
        var ctx = cvs.getContext("2d");
        ctx.drawImage(this.state.data, 0,0, 500, cvs.height);
        var imgdata = ctx.getImageData(0,0, 500, cvs.height);
        var data = imgdata.data;
        var temp = temperature(this.state.temperature);
        for(var i=0; i<data.length; i+=4) {
          imgdata.data[i]   = data[i]   + (temp[0] - 255);
          imgdata.data[i+1] = data[i+1] + (temp[1] - 255);
          imgdata.data[i+2] = data[i+2] + (temp[2] - 255);
          imgdata.data[i+3] = 255;
        }
        ctx.putImageData(imgdata, 0, 0);
      });
    }.bind(this);
  },

  setData: function(img) {
    var w = img.width, h = img.height;
    this.setState({
      width: w,
      height: h,
      data: img
    }, function() {
      this.changeTemperature(this.state.temperature)();
    });
  }

});

module.exports = ImageEditor;
