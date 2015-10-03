'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var Context = require('./Context');
var Buffers = require('./Buffers');
//var TrackForm = require('./TrackForm');
//var TrackList = require('./TrackList');
var TrackWrapper = require('./TrackWrapper');
var CurrentTrack = require('./CurrentTrack');
var SequencerHeader = require('./SequencerHeader');

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
      currentTrack: null,
      initilized: false
    }};
  },
  handleTrackSubmit: function(newTrack) {
    var tracks = this.state.data.tracks;
    var newTracks = tracks.concat([newTrack]);
    this.state.data.tracks = newTracks;
    this.setState(this.state);
    this.state.data.tracks = TrackWrapper.getTracks();
    this.setState(this.state);
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
    TrackWrapper.setTrackTempo(tempo);
    this.state.data.currentTrack.tempo = tempo;
    this.setState(this.state);
  },
  setPatternTempo: function () {

  },
  releasePatternTempo: function () {

  },
  handleNewPattern: function (newPatternData) {
    var newPattern = TrackWrapper.createPattern(newPatternData.beat, newPatternData.noteValue, newPatternData.name);
    newPatternData.lines.map(function (line) {
      TrackWrapper.addLine(newPattern.id, line.buffer, line.subDivision);
    });
    return TrackWrapper.getCurrentTrack();
  },
  handleNewTrack: function (newTrack) {
    var tracks = this.state.data.tracks;
    var newTracks = tracks.concat([newTrack]);
    this.state.data.tracks = newTracks;
    this.setState(this.state);
    this.state.data.tracks = TrackWrapper.getTracks();
    this.setState(this.state);
    this.handleTrackSelect(TrackWrapper.getCurrentTrack());
  },
  handleTrackNameChange: function (newName) {
    console.log(newName);
    TrackWrapper.changeTrackName(newName);
    this.state.data.currentTrack = TrackWrapper.getCurrentTrack();
    this.setState(this.state);
  },
  render: function() {
    return (
      <ReactTransitionGroup transitionName="fade" component="div" className="main">
        <SequencerHeader onTrackCreate={this.handleNewTrack} />
        <CurrentTrack
          onNewPattern={this.handleNewPattern}
          data={this.state.data.currentTrack}
          onTrackTempo={this.setTrackTempo}
          onPatternTempo={this.setPatternTempo}
          onTrackNameChange={this.handleTrackNameChange}
          onReleasePatternTempo={this.releasePatternTempo}/>
      </ReactTransitionGroup>
    );
  }
});

module.exports = SequencerReactApp;
