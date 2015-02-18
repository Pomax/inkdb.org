var React = require("react");

var InkProperties = React.createClass({

  render: function() {
    var ink = this.props.ink;
    var pick = function(arr) {
      return arr[(Math.random()*arr.length)|0];
    };

    ink.properties = {
      drytime: pick(["very fast","fast","normal","slow","very slow"]),
      flow: pick(["very thin","thin","normal", "thick", "very thick"]),
      shading: pick(["uniform","two tone","graduating"]),
      nibtype: pick(["plain","semi-flex","flex"]),
      cost: pick(["0-10","10-15","15-20","20-25","25-30","30+"]),
      fluorescence: pick(["plain","mildly fluorescent","fluorescent","highlighter"]),
      solution: pick(["dye","mixed","paint"]),
      deposit: pick(["clear","settling","intended"]),
      rating: pick([0,1,2,3,4,5,6,7,8,9,10])
    };
    
    var divs = Object.keys(ink.properties).map(key => {
      var cn = "property " + key;
      var val = ink.properties[key];
      return <div className={cn} data-value={val} key={key} />;
    });
    
    return <div className="properties">{divs}</div>;
  }

});

module.exports = InkProperties;