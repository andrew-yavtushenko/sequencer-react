'use strict';

var React = require('react/addons');
var SortableMixin = require('./react-sortable-mixin.js');
var PatternComponent = require('./PatternComponent');

var PatternList = React.createClass({
  mixins: [SortableMixin],
  sortableOptions: {
    model: 'patterns',
    ref: 'pattern'
  },
  getInitialState: function () {
    return {
      patterns: this.props.patterns,
      showEditForm: false
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
            <PatternComponent
              trackTempo={this.props.trackTempo}
              key={patternKey}
              newTrack={false}
              handlePatternsUpdate={this.props.handlePatternsUpdate}
              duplicate={this.duplicate.bind(this, pattern)}
              data={pattern}/>
          );
        }.bind(this))
      }</ul>
    );
  }
});

module.exports = PatternList;
