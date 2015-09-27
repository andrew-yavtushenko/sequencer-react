'use strict';

var React = require('react/addons');
var SortableMixin = require('./react-sortable-mixin.js');
var Settings = require('./Settings');

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
          console.log(pattern.lines);
          return (
            <li>
              {pattern.name}&nbsp;&nbsp;{pattern.beat}/{pattern.noteValue}
              <ul>{
                pattern.lines.map(function (line){
                  return <li>{line.bufferIdx + ' ' + Settings.subDivisionNames[line.subDivision]}</li>;
                })
              }</ul>
            </li>
          );
        })
      }</ul>
    );
  }
});

module.exports = PatternList;
