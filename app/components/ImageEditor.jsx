var React = require("react");
var temperature = require("../lib/temperature");
var inkmatch = require("../lib/inkmatch");

var ImageEditor = React.createClass({

  getInitialState: function() {
    return {
      temperature: 6500,
      pal: [],
      colorsonly: false,
      processing: false
    };
  },

  render: function() {
    var temperatures = [];
    for(var i=4000; i<9500; i+=50) { temperatures.push(i); }
    temperatures = temperatures.map(T => {
      var temp = temperature(T);
      var style = {
        backgroundColor: "rgb("+(temp[0]|0)+","+(temp[1]|0)+","+(temp[2]|0)+")",
      };
      var className = "temperature";
      if(T === this.state.temperature) {
        className += " selected";
      }
      return <div className={className} style={style} onClick={this.changeTemperature(T)} title={T}/>;
    });

    var pal = this.state.pal.filter(color => {
      if(this.state.colorsonly) {
        var hsl = color.hsl(), s = hsl[1], l = hsl[2];
        return s > 0.15 && l > 0.3;
      }
      return true;
    }).map(v => {
      var hsl = v.hsl();
      var style = {
        backgroundColor: "hsl("+(hsl[0]|0)+","+((100*hsl[1])|0)+"%,"+((100*hsl[2])|0)+"%)"
      };
      return <button className="pal" style={style} onClick={this.listMatches(v)} />;
    });

    return <div className="imageeditor">
      <img ref="base" hidden="hidden"/>
      <canvas ref="canvas"></canvas>
      <div className="temperatures">{temperatures}</div>
      <button hidden={this.state.processing} onClick={this.analyse}>Analyse</button>
      <div>{pal}</div>
    </div>;
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
      inkmatch(cvs.toDataURL("image/jpeg"), function(err, result) {
        self.setState({
          pal: result.pal,
          processing: false
        });
      });
    });
  },

  changeTemperature: function(T) {
    return function(evt) {
      this.setState({ temperature: T }, function() {
        var cvs = this.refs.canvas.getDOMNode();
        var ctx = cvs.getContext("2d");
        if(cvs.width !== this.state.width || cvs.height !== this.state.height) {
          cvs.width = this.state.width;
          cvs.height = this.state.height;
        }
        var imgdata = ctx.getImageData(0,0,cvs.width,cvs.height);
        var data = this.state.data;
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

  setData: function(result) {
    var w = result.width,
        h = result.height;
    this.setState({
      width: w,
      height: h,
      data: result.data
    }, function() {
      this.changeTemperature(this.state.temperature)();
    });
  }

});

module.exports = ImageEditor;
