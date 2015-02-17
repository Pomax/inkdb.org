var React = require("react");
var Crop = require("./Crop.jsx");

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
        className = "ink swatch" + (this.state.selected ? " selected" : ""),
        buy = "http://www.gouletpens.com/search?query=" +
                    this.state.company.replace(/ /g,"+") +
                    "+" +
                    this.state.inkname.replace(/ /g,"+");
    return (
      <div className={className} onClick={this.inkClicked}>
        <div className="ink color preview" style={bstyle}>
          {this.entryContent()}
          <Crop company={this.state.company} inkname={this.state.inkname} src={imgSrc} />
        </div>
        <span className="company">{this.state.company}</span>
        <span className="inkname">{this.state.inkname}</span>
        <div className="buy">
          <a className="ion-android-cart"
             href={buy}
             target="_blank"
             title="Buy this ink at gouletpens.com"
             onClick={this.stopClick} />
        </div>
      </div>
    );
  },

  stopClick: function(evt) {
    evt.stopPropagation();
  },

  inkClicked: function(evt) {
    this.props.inkClicked(this);
  },

  entryContent: function() {
    return <span>&nbsp;</span>;
  }

});

module.exports = Ink;