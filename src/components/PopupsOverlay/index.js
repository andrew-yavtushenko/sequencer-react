require('./PopupsOverlay.css');
var React = require('react/addons');

var types = {
  PatternContextMenu: require('components/PatternContextMenu')
};

var PopupOverlay = React.createClass({
  displayName: 'PopupOverlay',
  onBlur: function () {
    this.props.actions.popups.close();
  },
  render: function () {
    if (this.props.popups.length < 1) {
      return false;
    }

    return (
      <div className="popups-overlay" onClick={this.onBlur}>
        {this.props.popups.map(function (pp, index) {
          var PopupClass = types[pp.popupClass];
          var pos = pp.position;
          var left = Math.round(pos.left + 0.5 * pos.width);
          var style = { top: pp.position.bottom, left: left };

          if (PopupClass) {
            return <PopupClass key={index} style={style} {...pp} {...this.props} />;
          }
        }, this)}
      </div>
    );
  }
});

module.exports = PopupOverlay;
