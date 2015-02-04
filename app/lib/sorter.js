var globalSortingProperty;

var sortObject = {

  setSorting: function(prop) {
    globalSortingProperty = prop;
  },

  sort: function(a, b, prop) {
    prop = prop || globalSortingProperty;
    if(prop === "color") {
      return sortObject.sortByColor(a,b);
    }
    if(prop === "name") {
      return sortObject.sortByName(a,b);
    }
    var _a = a[prop];
    var _b = b[prop];
    return _a < _b ? -1 : _a > _b ? 1 : sortObject.sortByName(a,b);
  },

  sortByName: function(a,b) {
    var _a = a.company;
    var _b = b.company;
    if (_a < _b) {
      return -1;
    }
    if (_a > _b) {
      return 1;
    }
    _a = a.inkname;
    _b = b.inkname;
    // We should not be able to get a==b here.
    return _a < _b ? -1 : _a > _b ? 1 : 0;
  },

  // sorting "by color" requires some smarties
  sortByColor: function(a,b) {
    return sortObject.sort(a, b, "H");

    /*
      But we really want to split out three
      parts: darks, neutrals, and colors.

      So, we need to rank based on:
      - L < 0.3 (darks)
      - S < 0.1 (neutral)
      - H (everything else)
    */

/*
    var LT = 0.15;
    if(a.L < LT) {
      if(b.L < LT) {
        return a.L - b.L;
      }
      return -1;
    }
    if(b.L < LT) {
      return 1;
    }

    var ST = 0.1;
    if(a.S < ST) {
      if(b.S < ST) {
        return a.S - b.S;
      }
      return -1;
    }
    if(b.S < ST) {
      return 1;
    }

    return sortObject.sort(a,b,"H");
*/
  }
};

module.exports = sortObject;
