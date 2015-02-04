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

    var w = innerWidth/2;
    var h = innerHeight/2;
    var xf = w / (max - min);
    var yf = h / (max - min);

    var self = this;
    var elements = points.map(function(entry) {
      var x = xf * entry.distance * Math.cos(entry.angle),
          y = yf * entry.distance * Math.sin(entry.angle),
          scale = 0.75 + 0.5 * (x+y)/(w+h);

      x = 50 * x/w;
      y = 40 * y/h;

      var style = {
        background: "rgb("+entry.r+","+entry.g+","+entry.b+")",
        transform: "translate(50vw, 40vh) translate("+x+"vw, "+y+"vh) scale("+scale+")"
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
        <h1>Color distances in Fountain Pen land</h1>
        <h2 ref="info"></h2>
        {elements}
      </div>
    );
  },

});

module.exports = InkCloud;
