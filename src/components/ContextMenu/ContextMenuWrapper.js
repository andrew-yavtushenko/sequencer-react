'use strict';

var React = require('react/addons');
var ContextMenuWrapper = React.createClass({
  displayName: 'ContextMenuWrapper',
  propTypes: {
    data: React.PropTypes.object,
    popupClass: React.PropTypes.string.isRequired
  },
  openPopup: function (e) {
    var dom, rect;

    e.preventDefault();
    dom = React.findDOMNode(this);
    dom = dom.children[0] || dom;
    rect = dom.getBoundingClientRect();

    this.props.actions.popups.open({
      data: this.props.data,
      popupClass: this.props.popupClass,
      position: rect
    });
  },
  render: function () {
    var className = this.props.className || '';
    var activePopup = this.props.popups[0];
    if (activePopup && activePopup.data.id === this.props.data.id) {
      className += ' active';
    }

    return (
        <a href="#"
           className={className}
           onClick={this.openPopup}>
          {this.props.children}
        </a>
    );
  }
});

module.exports = ContextMenuWrapper;
