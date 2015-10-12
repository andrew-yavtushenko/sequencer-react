'use strict';

var React = require('react/addons');
var SortableMixin = require('react-sortable-mixin');
var PatternComponent = require('components/PatternComponent');

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
    this.props.onPatternMove(event.oldIndex, event.newIndex);
  },
  handlePatternDuplicate: function (pattern) {
    this.props.onPatternDuplicate(pattern);
  },
  handleCancel: function (index, pattern) {
    this.state.patterns[index] = pattern;
    this.setState(this.state);
  },
  render: function () {
    return (
      <ul ref='patterns' className='PatternList'>{
        this.state.patterns.map(function (pattern, patternKey) {
          return (
            <PatternComponent
              actions={this.props.actions}
              trackTempo={this.props.trackTempo}
              key={patternKey}
              newTrack={false}
              onCancel={this.handleCancel.bind(this, patternKey)}
              onPatternUpdate={this.props.onPatternUpdate}
              duplicate={this.handlePatternDuplicate.bind(this, pattern)}
              onDeletePattern={this.props.onDeletePattern}
              data={pattern}/>
          );
        }.bind(this))
      }</ul>
    );
  }
});

module.exports = PatternList;
