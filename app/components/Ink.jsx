var React = require("react");

var Ink = React.createClass({

  getInitialState: function() {
    return this.props.data;
  },

  render: function() {
    var r = this.state.r,
        g = this.state.g,
        b = this.state.b,
        c = this.state.L < 0.3 ? "white" : "black",
        bstyle = { background: "rgb("+r+","+g+","+b+")", color: c },
        imgSrc = "inks/images/" + this.state.images + "/crop.png",
        className = "ink swatch" + (this.state.selected ? " selected" : "");

    return (
      <div className={className} onClick={this.inkClicked}>
        <div className="ink color preview" style={bstyle}>
          {this.entryContent()}
          <img src={imgSrc} className="ink crop image" />
        </div>
        <span className="company">{this.state.company}</span>
        <span className="inkname">{this.state.inkname}</span>
      </div>
    );
  },

  inkClicked: function(evt) {
    this.props.inkClicked(this);
  },

  entryContent: function() {
    // var H = (""+this.state.H).substring(0,5),
    //     S = (""+this.state.S).substring(0,5),
    //     L = (""+this.state.L).substring(0,5);
    // var R = (""+this.state.r).substring(0,5),
    //     G = (""+this.state.g).substring(0,5),
    //     B = (""+this.state.b).substring(0,5);
    // var i = (""+this.state.i).substring(0,5),
    //     spread = (""+this.state.spread.max).substring(0,5);

    return <span>&nbsp;</span>;

    // var distance = this.state.distance || "-";
    // var angle = this.state.angle || "-";
    // return <span>{distance}<br/>{angle}</span>;

    // return (
    //   <span>
    //     {H}, {S}, {L} <br/>
    //     {R}, {G}, {B} <br/>
    //      i: {i}, spread: {spread}
    //   </span>
    // );
  }

});

module.exports = Ink;