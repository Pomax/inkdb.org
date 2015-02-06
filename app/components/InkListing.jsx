var React = require("react");
var Ink = require("./Ink.jsx");
var sorter = require("../lib/sorter");

var InkListing = React.createClass({

  getInitialState: function() {
    return {
      sortingProperty: "color"
    };
  },

  render: function() {
    var sortValue = this.state.sortingProperty;
    sorter.setSorting(sortValue);
    var inkCount = this.props.inks.all.length;
    return (
      <div className="ink listing" id="top">
        <h1>A repository of {inkCount} fountain pen inks.</h1>

        <div>
          <span>
            filter: <select value={sortValue} onChange={this.setSorting}>
              <option value="color">by color</option>
              <option value="name">by name</option>
              <option value="H">by hue</option>
              <option value="S">by saturation</option>
              <option value="L">by luminoscity</option>
            </select>
          </span>

          <span>
            filter company: <input
              type="text"
              onChange={this.setCompanyFilter}
              placeholder="type text here" />
          </span>

          <span>
            filter name: <input
              type="text"
              onChange={this.setNameFilter}
              placeholder="type text here" />
          </span>
        </div>

        <p>Click an ink to see its position in the colour constellation</p>

        <div>
          <a href="#colors">colors</a> <a href="#neutrals">neutrals</a> <a href="#darks">darks</a>
        </div>

        <div>
          <h2 id="colors">Colors</h2>
          { this.buildListing(this.props.inks.colors)   }
          <h2 id="neutrals">Neutrals (<a href="#top">top</a>)</h2>
          { this.buildListing(this.props.inks.neutrals) }
          <h2 id="darks">Darks (<a href="#top">top</a>)</h2>
          { this.buildListing(this.props.inks.darks)    }
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    this.scrollTo();
  },

  componentDidUpdate: function() {
    this.scrollTo();
  },

  scrollTo: function() {
    var position = document.querySelector(".selected.ink.swatch");
    if(position) {
      position = position.getBoundingClientRect().top - 100;
      scrollTo(0, position)
    }
  },

  buildListing: function(list) {
    list = list.sort(sorter.sort);
    var re;
    if(this.state.nameFilter) {
      re = new RegExp(this.state.nameFilter, "i");
      list = list.filter(function(entry) {
        return !!entry.inkname.match(re);
      });
    }
    if(this.state.companyFilter) {
      re = new RegExp(this.state.companyFilter, "i");
      list = list.filter(function(entry) {
        return !!entry.company.match(re);
      });
    }
    var self = this;
    list = list.map(function(data) {
      var realign = function() {
        self.props.inkClicked(data);
      };
      return <Ink data={data} key={data.id} inkClicked={realign} />;
    });
    return list;
  },

  setCompanyFilter: function(evt) {
    this.setState({ companyFilter: evt.target.value });
  },

  setNameFilter: function(evt) {
    this.setState({ nameFilter: evt.target.value });
  },

  setSorting: function(evt) {
    this.setState({ sortingProperty: evt.target.value });
  }

});

module.exports = InkListing;