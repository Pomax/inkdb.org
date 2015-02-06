var React = require("react");

var ViewSelector = React.createClass({

  getInitialState: function() {
    return {
      view: this.props.mode,
      views: [ "grid", "cloud" ]
    };
  },

  render: function() {
    var options = this.state.views.map(function(e) {
      return <option value={e}>{e} layout</option>;
    });
    return (
      <select className="viewselector" value={this.state.view} onChange={this.viewModeChanged}>
        {options}
      </select>
    );
  },

  viewModeChanged: function(evt) {
    var value = evt.target.value;
    this.setState({
      view: value
    });
    this.props.changeViewMode(value);
  },

  setMode: function(mode) {
    this.setState({
      view: mode
    });
  }

});

module.exports = ViewSelector;
