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
  handleSort: function (event) {
    this.props.handlePatternSort(event.oldIndex, event.newIndex);
  },
  duplicate: function (pattern) {
    this.props.handlePatternDuplicate(pattern);
  },
  render: function () {
    return (
      <ul ref='patterns' className='PatternList'>{
        this.state.patterns.map(function (pattern, patternKey) {
          return (
            <li key={patternKey}>
              {pattern.name}&nbsp;&nbsp;{pattern.beat}/{pattern.noteValue}
              <div className="duplicate">
                <a href="#" onClick={this.duplicate.bind(this, pattern)}>duplicate</a>
              </div>
              <ul>{
                pattern.lines.map(function (line, key){
                  return <li key={key}>{line.bufferIdx + ' ' + Settings.subDivisionNames[line.subDivision]}</li>;
                })
              }</ul>
            </li>
          );
        }.bind(this))
      }</ul>
    );
  }
});

module.exports = PatternList;
