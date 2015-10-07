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
  updateVolume: function (pattern, line, lineId, noteId, event) {
    event.preventDefault();
    var volume = this.state.data.getPattern(pattern.id).lines[lineId].updateVolume(noteId);
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
  render: function () {
    return (
      <div className="patterns">
        {
          this.state.data.patterns.map(function (pattern, patternKey) {
            return (
              <div key={patternKey} className="pattern">
                {pattern.id}
                <ul className="lines">
                  {
                    pattern.lines.map(function (line, lineKey) {
                      return (
                        <li key={lineKey}>{
                          <ul className="notes" data-buffer={line.bufferIdx}>{
                            line.notes.map(function (note, noteKey) {
                              return (
                                <li
                                  onClick={this.updateVolume.bind(this, pattern, line, lineKey, noteKey)}
                                  data-note-volume={note.volume}
                                  data-note-size={note.value}
                                  ref={pattern.id + '-' + lineKey + '-' + noteKey}
                                  key={noteKey}
                                  className="note">
                                </li>
                              );
                            }.bind(this))
                          }</ul>
                        }</li>
                      );
                    }.bind(this))
                  }
                </ul>
              </div>
            );
          }.bind(this))
        }
      </div>
    );
  }
});
