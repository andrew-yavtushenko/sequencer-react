'use strict';

var React = require('react/addons');

module.exports = React.createClass({
  componentDidMount: function () {
    window.addEventListener('blink', this.blink);
  },
  getInitialState: function () {
    return {
      data: this.props.data
    };
  },
  updateVolume: function (pattern, beat, lineId, note, noteId, event) {
    event.preventDefault();
    var volume = beat.lines[lineId].updateVolume(noteId);
    this.props.updateVolume(pattern.id, beat.id, lineId, noteId, volume);
    this.setState(this.state);
  },
  stopNote: function (note) {
    note.setAttribute('data-is-on', false);
  },
  blink: function (e) {
    var data = e.detail;
    var note = this.refs[data.patternId + '|' + data.beatId + '|' + data.lineId + '|' + data.noteId].getDOMNode();
    note.setAttribute('data-is-on', true);
    setTimeout(this.stopNote.bind(this, note), data.duration);
  },
  renderNote: function (pattern, beat, lineKey, note, noteKey) {
    return (
      <li
        onClick={this.updateVolume.bind(this, pattern, beat, lineKey, note, noteKey)}
        data-note-volume={note.volume}
        data-note-size={note.value}
        ref={pattern.id + '|' + beat.id + '|' + lineKey + '|' + noteKey}
        key={noteKey}
        className="note">
      </li>
    );
  },
  renderLine: function (pattern, beat, line, lineKey) {
    return (
      <li key={lineKey} className="line">{
        <ul className="notes" data-buffer={line.bufferIdx}>{
          line.notes.map(this.renderNote.bind(this, pattern, beat, lineKey))
        }</ul>
      }</li>
    );
  },
  renderBeat: function (pattern, beat, beatKey) {
    return (
      <li key={beatKey} className="beat">
        {<ul className="lines">{
          beat.lines.map(this.renderLine.bind(this, pattern, beat))
        }</ul>
      }</li>
    );
  },
  renderPattern: function (pattern, patternKey) {
    return (
      <li key={patternKey} className="pattern">
        <div className="pattern-name">{pattern.name}</div>
        <ul className="beats">{
          pattern.beats.map(this.renderBeat.bind(this, pattern))
        }</ul>
      </li>
    );
  },
  render: function () {
    return (
      <ul className="patterns">
        {
          this.state.data.patterns.map(this.renderPattern)
        }
      </ul>
    );
  }
});
