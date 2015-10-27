'use strict';

var React = require('react/addons');
var TrackWrapper = require('components/TrackWrapper');
var CurrentTrack = require('components/CurrentTrack');

module.exports = React.createClass({
  handleTrackNameChange: function (newName) {
    TrackWrapper.changeTrackName(newName);
    this.props.track.editName(newName);
    this.updateCurrentTrack(this.props.track);
  },
  updateCurrentTrack: function (currentTrack) {
    this.props.onUpdateTrack(currentTrack);
  },
  handleTempoChange: function (tempo) {
    TrackWrapper.setTrackTempo(tempo, function () {
      this.props.track.setTempo(tempo);
    }.bind(this));
  },
  handlePatternUpdate: function (updatedPattern) {
    TrackWrapper.updatePattern(updatedPattern, this.updateCurrentTrack);
  },
  handleNewPattern: function (newPattern) {
    TrackWrapper.savePattern(newPattern, this.updateCurrentTrack);
  },
  handlePatternDuplicate: function (patternId) {
    TrackWrapper.duplicatePattern(patternId, this.updateCurrentTrack);
  },
  movePattern: function (oldIndex, newIndex) {
    TrackWrapper.movePattern(oldIndex, newIndex, this.updateCurrentTrack);
  },
  deletePattern: function (patternId) {
    TrackWrapper.deletePattern(patternId, this.updateCurrentTrack);
  },
  handlePatternTempoChange: function (tempo, patternId) {
    TrackWrapper.setPatternCustomTempo(tempo, patternId);
  },
  releasePatternCustomTempo: function (patternId) {
    TrackWrapper.releasePatternCustomTempo(patternId);
  },
  handleCounterChange: function (patternId, counter) {
    TrackWrapper.changePatternCounter(patternId, counter, this.updateCurrentTrack);
  },
  render: function () {
    return (
      <div className='track'>
        <CurrentTrack
          data={this.props.track}
          onNewPattern={this.handleNewPattern}
          onPatternUpdate={this.handlePatternUpdate}
          onDeletePattern={this.deletePattern}
          onPatternDuplicate={this.handlePatternDuplicate}
          onPatternTempoRelease={this.releasePatternCustomTempo}
          onPatternTempoChange={this.handlePatternTempoChange}
          onPatternCounterChange={this.handleCounterChange}
          onPatternMove={this.movePattern}
          onTempoChange={this.handleTempoChange}
          onTrackNameChange={this.handleTrackNameChange}/>
      </div>
    );
  }
});
