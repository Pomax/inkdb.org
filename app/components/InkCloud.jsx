var React = require("react");

var InkCloud = React.createClass({

  render: function() {
    var points = this.props.inks.all;
    var min = 9999;
    var max = -min;

    points.forEach(function(entry) {
      if(entry.distance < min) { min = entry.distance; }
      if(entry.distance > max) { max = entry.distance; }
    });

    var diff = max - min;
    var w = innerWidth/2;
    var h = innerHeight/2;
    var xf = w / diff;
    var yf = h / diff;

    var self = this;
    var elements = points.map(function(entry) {
      var x = xf * entry.distance * Math.cos(entry.angle),
          y = yf * entry.distance * Math.sin(entry.angle),
          xscale = 1 + -0.4 * entry.distance/diff;

      x = 50 * x/w;
      y = 40 * y/h;

      var yscale = 1;//(y-20)/20;


      var style = {
        background: "rgb("+entry.r+","+entry.g+","+entry.b+")",
        transform: "translate(50vw, 40vh) translate("+x+"vw, "+y+"vh) scale("+(xscale*yscale)+")"
      };

      var realign = function(evt) {
        evt.stopPropagation();
        self.props.inkClicked(entry);
      };

      var className = "inkpoint";

      if (entry.distance === 0) {
        className += " selected";
      }

      var showInfo = function(evt) {
        self.refs.info.getDOMNode().innerHTML = entry.company + " " + entry.inkname;
      };

      return <div className={className}
                  style={style}
                  onMouseOver={showInfo}
                  onClick={realign}></div>;
    });

    var switchBack = function() {
      self.props.switchMode("list");
    };

    return (
      <div className="inkcloud">
        <div className="listlink" onClick={switchBack}>Back to the list view</div>
        <header>
          <h1>Color distances in Fountain Pen land</h1>
          <p>The closer a color is to the central color, the closer they are in L*a*b space.</p>
          <h2 ref="info"></h2>
        </header>
        {elements}
      </div>
    );
  },

});

module.exports = InkCloud;
