'use strict';

var React = require('react/addons');
var SortableMixin = require('./SortableMixin');
var Settings = require('components/Settings');

module.exports = React.createClass({
  mixins: [SortableMixin],
  sortableOptions: {
    model: 'beats',
    ref: 'beat',
    group: 'beatData'
  },
  getInitialState: function () {
    return {
      beats: this.props.data
    };
  },
  componentDidUpdate: function (props, state) {
    if (props.data.length !== state.beats.length) {
      this.state.beats = props.data;
      this.setState(this.state);
    }
  },
  renderLine: function (line, lineKey) {
    return (
      <li key={lineKey}>
        {line.bufferIdx + ' ' + Settings.subDivisionNames[line.subDivision]}
      </li>
    );
  },
  renderBeat: function (beat, beatKey) {
    return (
      <li key={beatKey} id={beat.id} ref={beat.id}>
        {beat.beat}/{beat.noteValue}
        <ul>{
          beat.lines.map(this.renderLine)
        }</ul>
      </li>
    );
  },
  handleAdd: function (event) {
    this.props.onPatternInsert(this.state.beats[event.newIndex], event.newIndex);
  },
  handleRemove: function (event) {
    this.props.onPatternRemove(event.item.id);
    this.setState(this.state);
  },
  handleUpdate: function (event) {
    this.props.onPatternMove(event.newIndex, event.oldIndex);
  },
  render: function () {
    return (
      <ul ref="beats" className="BeatsList">{
        this.state.beats.map(this.renderBeat)
      }</ul>
    );
  }
});
