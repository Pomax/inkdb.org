var React = require("react");

var Crop = React.createClass({

  mixins: [
    require("react-component-visibility")
  ],

  getInitialState: function() {
    return {
      src: ""
    };
  },

  componentVisibilityChanged: function() {
    if(this.state.visible && !this.state.src) {
      this.setState(
        {
          src: this.props.src
        },
        function() {
          // we no longer care about visibility,
          // so let's just turn it off.
          this.disableVisbilityHandling();
        }
      );
    }
  },

  render: function() {
    return <img className="ink crop image" src={this.state.src} />;
  }

});

module.exports = Crop;
