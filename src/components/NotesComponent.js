'use strict';

var React = require('react/addons');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data
    };
  },
  updateVolume: function (pattern, line, lineId, noteId, event) {
    event.preventDefault();
    var volume = line.updateVolume(noteId);
    this.props.updateVolume(pattern.id, lineId, noteId, volume);
    this.setState(this.state);
  },
  blink: function () {

  },
  render: function () {
    return (
      <div className="patterns">
        {
          this.state.data.patterns.map(function (pattern, patternKey) {
            return (
              <div key={patternKey} className="pattern">
                {pattern.name}
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
                                  data-is-on={note.isCurrent}
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
