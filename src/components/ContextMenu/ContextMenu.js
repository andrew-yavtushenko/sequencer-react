'use strict';

var React = require('react/addons');
var ContextMenuItem = require('./ContextMenuItem');

var ContextMenu = React.createClass({
  displayName: 'ContextMenu',
  render: function () {
    return (
        <div class="ContextMenu">
          <ul>
            <ContextMenuItem icon="edit" text="Edit pattern" />
            <ContextMenuItem icon="duplicate" text="Duplicate pattern" />
            <ContextMenuItem icon="save" text="Save pattern to library" />
            <ContextMenuItem icon="delete" text="Delete pattern" />
          </ul>
        </div>
    );
  }
});

module.exports = ContextMenu;
