'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var Context = require('components/Context');
var Buffers = require('components/Buffers');
var TrackWrapper = require('components/TrackWrapper');
var CurrentTrack = require('components/CurrentTrack');
var SequencerHeader = require('components/SequencerHeader');
var NotesComponent = require('components/NotesComponent');
var mapValues = require('lodash/object/mapValues');
var actions = require('actions');
var { bindActionCreators } = require('redux');
var { connect } = require('react-redux');

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
  handlePatternUpdate: function (updatedPattern) {
    TrackWrapper.updatePattern(updatedPattern, this.updateCurrentTrack);
  },
  handleNewPattern: function (newPattern) {
    TrackWrapper.savePattern(newPattern, this.updateCurrentTrack);
  },
  handleNewTrack: function () {
    this.state.data.currentTrack = TrackWrapper.createTrack('');
    this.state.data.tracks = TrackWrapper.getTracks();
    this.setState(this.state);
  },
  handleTrackNameChange: function (newName) {
    TrackWrapper.changeTrackName(newName);
    this.state.data.currentTrack.name = newName;
    this.setState(this.state);
  },
  handlePatternDuplicate: function (patternId) {
    TrackWrapper.duplicatePattern(patternId, this.updateCurrentTrack);
  },
  movePattern: function (oldIndex, newIndex) {
    TrackWrapper.movePattern(oldIndex, newIndex, this.updateCurrentTrack);
  },
  updateVolume: function (patternId, beatId, lineId, noteId, volume) {
    TrackWrapper.updateNoteVolume(patternId, beatId, lineId, noteId, volume);
  },
  play: function () {
    console.profile('react');

    TrackWrapper.startPlayback();
  },
  stop: function () {
    TrackWrapper.stopPlayback();

    console.profileEnd('react');
  },
  deletePattern: function (patternId) {
    TrackWrapper.deletePattern(patternId, this.updateCurrentTrack);
  },
  updateCurrentTrack: function (currentTrack) {
    this.state.data.currentTrack = currentTrack;
    this.setState(this.state);
  },
  handleTempoChange: function (tempo) {
    TrackWrapper.setTrackTempo(tempo, function () {
      this.state.data.currentTrack.tempo = tempo;
      this.setState(this.state);
    }.bind(this));
  },
  handleCreateLoop: function (patterns) {
    TrackWrapper.createLoop(patterns, this.updateCurrentTrack);
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
              onCreateLoop={this.handleCreateLoop}
              onNewPattern={this.handleNewPattern}
              onPatternUpdate={this.handlePatternUpdate}
              data={this.state.data.currentTrack}
              onTempoChange={this.handleTempoChange}
              onTrackNameChange={this.handleTrackNameChange}
              onPatternDuplicate={this.handlePatternDuplicate}
              onPatternMove={this.movePattern}
              onDeletePattern={this.deletePattern}/>
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

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        actions: mapValues(actions, function (obj) {
          return bindActionCreators(obj, dispatch);
        })
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(SequencerReactApp);
