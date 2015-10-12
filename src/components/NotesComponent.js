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
  updateVolume: function (pattern, lineId, noteId, event) {
    event.preventDefault();
    var volume = pattern.lines[lineId].updateVolume(noteId);
    this.props.updateVolume(pattern.id, lineId, noteId, volume);
    this.setState(this.state);
  },
  stopNote: function (note) {
    note.setAttribute('data-is-on', false);
  },
  blink: function (e) {
    var data = e.detail;
    var note = this.refs[data.patternId + '-' + data.lineId + '-' + data.noteId].getDOMNode();
    note.setAttribute('data-is-on', true);
    setTimeout(this.stopNote.bind(this, note), data.duration);
  },
  renderNote: function (pattern, lineKey, note, noteKey) {
    return (
      <li
        onClick={this.updateVolume.bind(this, pattern, lineKey, noteKey)}
        data-note-volume={note.volume}
        data-note-size={note.value}
        ref={pattern.id + '-' + lineKey + '-' + noteKey}
        key={noteKey}
        className="note">
      </li>
    );
  },
  renderLine: function (pattern, line, lineKey) {
    return (
      <li key={lineKey}>{
        <ul className="notes" data-buffer={line.bufferIdx}>{
          line.notes.map(this.renderNote.bind(this, pattern, lineKey))
        }</ul>
      }</li>
    );
  },
  renderPattern: function (pattern, patternKey) {
    return (<span key={patternKey}>{pattern.name}</span>);
    //return (
    //  pattern.isLoop ?
    //    <div key={patternKey} className="loop">
    //      {pattern.id}
    //      <ul className="patterns">
    //        {
    //          this.state.data.patterns.map(this.renderPattern)
    //        }
    //      </ul>
    //    </div> :
    //    <div key={patternKey} className="pattern">
    //      {pattern.name}
    //      <ul className="lines">
    //        {
    //          pattern.lines.map(this.renderLine.bind(this, pattern))
    //        }
    //      </ul>
    //    </div>
    //);
  },
  render: function () {
    return (
      <div className="patterns">
        {
          this.state.data.patterns.map(this.renderPattern)
        }
      </div>
    );
  }
});
