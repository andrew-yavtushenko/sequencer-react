'use strict';

var React = require('react/addons');
var SortableMixin = require('../SortableMixin');
var PatternComponent = require('components/PatternComponent');

module.exports = React.createClass({
  mixins: [SortableMixin],
  sortableOptions: {
    model: 'patterns',
    ref: 'pattern',
    handle: '.handle'
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
  handlePatternDuplicate: function (pattern, patternKey, patternId) {
    this.props.onPatternDuplicate(patternId);
  },
  handleCancel: function (index, pattern) {
    this.state.patterns[index] = pattern;
    this.setState(this.state);
  },
  renderPattern: function (pattern, patternKey) {
    return (
      <li key={patternKey} className="pattern">
        <PatternComponent
          trackTempo={this.props.trackTempo}
          newTrack={false}
          onCancel={this.handleCancel.bind(this, patternKey)}
          onPatternUpdate={this.props.onPatternUpdate}
          duplicate={this.handlePatternDuplicate.bind(this, pattern, patternKey)}
          onCounterChange={this.props.onPatternCounterChange}
          onDeletePattern={this.props.onDeletePattern}
          data={pattern}/>
      </li>
    );
  },
  render: function () {
    return (
      <ul ref='patterns' className='PatternList'>{
        this.state.patterns.map(this.renderPattern)
      }</ul>
    );
  }
});

