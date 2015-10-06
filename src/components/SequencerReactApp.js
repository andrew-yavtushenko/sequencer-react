'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var Context = require('./Context');
var Buffers = require('./Buffers');
var TrackWrapper = require('./TrackWrapper');
var CurrentTrack = require('./CurrentTrack');
var SequencerHeader = require('./SequencerHeader');
var NotesComponent = require('./NotesComponent');

require('normalize.css');
require('../styles/main.css');

var SequencerReactApp = React.createClass({
  loadBuffers: function () {
    Context.unlock(function () {
      Buffers.loadAll(function () {
        this.state.data.initilized = true;
        this.setState(this.state);
      }.bind(this));
    }.bind(this));
  },
  loadTracksFromServer: function() {
    this.state.tracks = TrackWrapper.getTracks();
    this.setState(this.state);
  },
  getInitialState: function () {
    return {data: {
      tracks: [],
      initilized: false
    }};
  },
  componentDidMount: function() {
    this.loadBuffers();
    this.loadTracksFromServer();
  },
  handleTrackSelect: function (track) {
    this.state.data.currentTrack = track;
    this.setState(this.state);
  },
  setTrackTempo: function (tempo) {
    TrackWrapper.setTrackTempo(tempo, function () {
      this.state.data.currentTrack.tempo = tempo;
      this.setState(this.state);
    }.bind(this));
  },
  setPatternTempo: function () {

  },
  releasePatternTempo: function () {

  },
  handleNewPattern: function (newPattern, callback) {
    TrackWrapper.savePattern(newPattern, function (currentTrack) {
      this.state.data.currentTrack = currentTrack;
      this.setState(this.state);
      callback(this.state.data.currentTrack);
    }.bind(this));
  },
  handleNewTrack: function () {
    this.state.data.currentTrack = TrackWrapper.createTrack('');
    this.state.data.tracks = TrackWrapper.getTracks();
    this.setState(this.state);
  },
  handleTrackNameChange: function (newName) {
    TrackWrapper.changeTrackName(newName);
    this.state.data.currentTrack = TrackWrapper.getCurrentTrack();
    this.setState(this.state);
  },
  duplicatePattern: function (pattern) {
    TrackWrapper.duplicatePattern(pattern);
    this.state.data.currentTrack = TrackWrapper.getCurrentTrack();
    this.setState(this.state);
  },
  patternMove: function (oldIndex, newIndex) {
    TrackWrapper.movePattern(oldIndex, newIndex);
    this.state.data.currentTrack = TrackWrapper.getCurrentTrack();
    this.setState(this.state);
  },
  updateVolume: function (patternId, lineId, noteId, volume) {
    TrackWrapper.updateNoteVolume(patternId, lineId, noteId, volume, function () {
      //console.log(arguments);
    });
  },
  play: function () {
    console.profile('react');

    TrackWrapper.startPlayback();
  },
  stop: function () {
    TrackWrapper.stopPlayback();

    console.profileEnd('react');
  },
  render: function() {
    return (
      <ReactTransitionGroup transitionName="fade" component="div" className="main">
        <SequencerHeader
          onPlay={this.play}
          onStop={this.stop}
          onTrackCreate={this.handleNewTrack} />
        {this.state.data.currentTrack ?
          <div className='track'>
            <CurrentTrack
              onNewPattern={this.handleNewPattern}
              data={this.state.data.currentTrack}
              onTrackTempo={this.setTrackTempo}
              onPatternTempo={this.setPatternTempo}
              onTrackNameChange={this.handleTrackNameChange}
              handlePatternDuplicate={this.duplicatePattern}
              handlePatternSort={this.patternMove}
              onReleasePatternTempo={this.releasePatternTempo}/>
            <NotesComponent
              updateVolume={this.updateVolume}
              data={this.state.data.currentTrack}/>
          </div> :
          <span>nope</span>
        }
      </ReactTransitionGroup>
    );
  }
});

module.exports = SequencerReactApp;
