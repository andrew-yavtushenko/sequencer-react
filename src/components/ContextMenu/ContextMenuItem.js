'use strict';

var React = require('react/addons');
var ContextMenu = React.createClass({
  displayName: 'ContextMenuItem',
  onClick: function (e) {
    if (this.props.onClick) {
      e.preventDefault();
      this.props.onClick();
    }
  },
  render: function () {
    var className = this.props.className || '';
    var href = this.props.href || '#';

    return (
        <li className={'ContextMenuItem ' + className}>
          <a className="ContextMenuItem-link"
             href={href}
             onClick={this.props.onClick}>{this.props.text}</a>
        </li>
    );
  }
});

module.exports = ContextMenu;
