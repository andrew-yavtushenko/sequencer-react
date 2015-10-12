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
    return (
        <a href="#"
           className={this.props.className}
           onMouseOver={this.openPopup}>
          {this.props.children}
        </a>
    );
  }
});

module.exports = ContextMenuWrapper;
