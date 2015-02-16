var React = require("react");

var InkLabel = React.createClass({

  getInitialState: function() {
    return {
      company: this.props.company || "",
      inkname: this.props.inkname || ""
    };
  },

  render: function() {
    return (
      <h2 clasName="label">{this.state.company} {this.state.inkname}</h2>
    );
  },

  setValuesFrom: function(entry) {
    this.setState({
      company: entry.company,
      inkname: entry.inkname
    });
  }

});

module.exports = InkLabel;
