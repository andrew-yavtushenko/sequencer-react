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
  renderLine: function (line, lineKey) {
    return (
      <tr key={lineKey}>
        <td>{line.bufferIdx}</td>
        <td>{Settings.subDivisionNames[line.subDivision]}</td>
      </tr>
    );
  },
  renderBeat: function (beat, beatKey) {
    return (
      <li key={beatKey} id={beat.id}>
        <span className="time-signature">{beat.beat}/{beat.noteValue}</span>
        <table>
          <tbody>{
            beat.lines.map(this.renderLine)
          }</tbody>
        </table>
      </li>
    );
  },
  handleAdd: function (event) {
    this.props.onPatternInsert(this.state.beats[event.newIndex], event.newIndex);
  },
  handleRemove: function (event) {
    this.props.onPatternRemove(event.item.id);
  },
  handleUpdate: function (event) {
    this.props.onPatternMove(event.newIndex, event.oldIndex);
  },
  render: function () {
    return (
      <ul ref="beats" className="BeatsList">{
        this.props.beats.map(this.renderBeat)
      }</ul>
    );
  }
});
