var React = require("react");
var InkLabel = require("./InkLabel.jsx");

var InkCloud = React.createClass({

  getInitialState: function() {
    return {
      darks: true,
      neutrals: true,
      colors: true
    };
  },

  render: function() {
    var elements = this.getElements();

    return (
      <div className="inkcloud">
        <header>
          <h1>Color distances in Fountain Pen land</h1>
          <p>Click a colour to bring it into focus, and click it again to view it in the colour grid.</p>
          <InkLabel ref="info"></InkLabel>
          {this.getToggles()}
        </header>
        <div className="cloud">{elements}</div>
      </div>
    );
  },

  getToggles: function() {
    var toggles = ["darks", "neutrals", "colors"].map(s => {
      return <span className="toggle" onClick={this.toggle(s)} key={s}>
        <input type="checkbox" checked={this.state[s]} /> {s}
      </span>;
    });
    return <div>{toggles}</div>;
  },

  toggle: function(type) {
    var self = this;
    return function() {
      var props = {};
      props[type] = !self.state[type];
      self.setState(props);
    };
  },

  /**
   * Generate ink points for all inks known to the system.
   * We also split it on
   */
  getElements: function() {
    var self = this;

    var points = this.props.inks.all;

    var min = 9999;
    var max = -min;

    points.forEach(entry => {
      if(entry.distance < min) { min = entry.distance; }
      if(entry.distance > max) { max = entry.distance; }
    });

    var diff = max - min;
    var w = innerWidth/2;
    var h = innerHeight/2;
    var xf = w / diff;
    var yf = h / diff;

    var realign = function(entry) {
      return function realign(evt) {
        evt.stopPropagation();
        self.realign(entry);
      };
    };

    var showInfo = function(entry) {
      return function(evt) {
        self.refs.info.setValuesFrom(entry);
      };
    };

    return points.filter(entry => {
      var darks = this.state.darks && entry.darks;
      var neutrals = this.state.neutrals && entry.neutrals;
      var colors = this.state.colors && entry.colors;
      return darks || neutrals || colors;
    }).map(function(entry) {
      var xscale = 1 + -0.4 * entry.distance/diff,
          x = xf * entry.distance * Math.cos(entry.angle),
          y = yf * entry.distance * Math.sin(entry.angle);
      x = 50 * x/w - 1.5;
      y = 40 * y/h - 7;
      var props = {
        className: "inkpoint" + (entry.distance === 0 ? " selected" : ""),
        style: {
          background: "rgb("+entry.r+","+entry.g+","+entry.b+")",
          transform: "translate(50vw, 45vh) translate("+x+"vw, "+y+"vh) scale("+(xscale)+")"
        },
        onMouseOver: showInfo(entry),
        onClick: realign(entry)
      };
      return <div {...props} key={entry.company + entry.inkname}></div>;
    });
  },

  realign: function(entry) {
    this.props.inkClicked(entry);
  }

});

module.exports = InkCloud;
