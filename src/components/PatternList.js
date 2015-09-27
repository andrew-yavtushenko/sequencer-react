'use strict';

var React = require('react/addons');
var SortableMixin = require('./react-sortable-mixin.js');

var PatternList = React.createClass({
  mixins: [SortableMixin],
  sortableOptions: {
    model: 'patterns',
    ref: 'pattern'
  },
  getInitialState: function () {
    return {
      patterns: this.props.patterns
    };
  },
  handleSort: function (event, sortable) {
    console.log('handleSort', event, sortable);
  },
  handleUpdate: function (event, sortable) {
    console.log('handleUpdate', event, sortable);
  },
  render: function () {
    return (
      <ul ref='patterns' className='PatternList'>{
        this.state.patterns.map(function (pattern) {
          return (
            <li>
              {pattern.id} {pattern.beat}/{pattern.noteValue}
            </li>
          );
        })
      }</ul>
    );
  }
});

module.exports = PatternList;
