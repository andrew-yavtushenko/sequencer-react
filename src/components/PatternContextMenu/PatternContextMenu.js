'use strict';

var React = require('react/addons');
var PatternContextMenu = React.createClass({
  displayName: 'PatternContextMenu',
  render: function () {
    var id = this.props.data.patternId;
    var pattern = this.props.actions.pattern;

    return (
      <ContextMenu>
        <ContextMenuItem className="icon-edit" text="Edit pattern"
                         onClick={() => pattern.edit(id)} />
        <ContextMenuItem className="icon-duplicate" text="Duplicate pattern"
                         onClick={() => pattern.duplicate(id)} />
        <ContextMenuItem className="icon-save" text="Save pattern to library"
                         onClick={() => pattern.save(id)} />
        <ContextMenuItem className="icon-delete" text="Delete pattern"
                         onClick={() => pattern.delete(id)} />
      </ContextMenu>
    );
  }
});

module.exports = PatternContextMenu;
