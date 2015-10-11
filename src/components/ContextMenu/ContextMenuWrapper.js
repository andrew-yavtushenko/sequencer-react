'use strict';

var React = require('react/addons');
var ContextMenuWrapper = React.createClass({
  displayName: 'ContextMenuWrapper',
  propTypes: {
    data: React.PropTypes.object,
    popupClass: React.PropTypes.string.isRequired
  },
  onClick: function (e) {
    var dom, rect;

    e.preventDefault();
    dom = React.findDOMNode(this);
    rect = dom.getBoundingClientRect();

    this.props.actions.popups.open({
      data: this.props.data,
      popupClass: this.props.popupClass,
      clickPosition: rect
    });
  },
  render: function () {
    return (
        <a href="#"
           className={this.props.className}
           onClick={this.onClick}>
          {this.props.children}
        </a>
    );
  }
});

module.exports = ContextMenuWrapper;
