'use strict';

var React = require('react/addons');
var Header = require('components/Header');
var auth = require('components/Auth');
var tracksApi = require('components/TracksApi');
var Context = require('components/Context');
var Buffers = require('components/Buffers');
var Editor = require('components/Editor');
var TrackWrapper = require('components/TrackWrapper');
var NotesComponent = require('components/NotesComponent');
var PlayButton = require('components/PlayButton');
var compileTrack = require('components/BufferCompiler');

require('normalize.css');
require('../styles/main.css');

require('components/getFavicons');


module.exports = React.createClass({
  getInitialState: function () {
    return {
      initialized: false,
      authenticated: false,
      userData: null,
      loginOptions: [],
      currentTrack: null,
      userTracks: [],
      trackId: null
    }
  },
  componentDidMount: function () {
    this.unlockContext().then(this.loadBuffers).then(this.initializeApp);
    this.checkAuthState();
    this.parseUrl(window.location.hash.split('/'));
  },
  initializeApp: function () {
    this.state.initialized = true;
    this.setState(this.state);
  },
  loadBuffers: function () {
    return new Promise(function (resolve) {
      Buffers.loadAll(resolve);
    });
  },
  unlockContext: function () {
    return new Promise(function (resolve) {
      Context.unlock(resolve);
    });
  },
  handleNewTrack: function (e) {
    e.preventDefault();
    e.stopPropagation();
    window.history.pushState({}, 'New Track', '/#');
    this.state.currentTrack = TrackWrapper.createTrack('');
    this.state.trackId = null;
    this.setState(this.state);
  },
  restoreTrack: function (data) {
    TrackWrapper.restore(data, this.setTrack);
  },
  setTrack: function (track) {
    this.state.currentTrack = track;
    this.setState(this.state);
  },
  loadTrack: function (id) {
    tracksApi.getTrack(id).then(this.restoreTrack).then(function () {
      this.state.trackId = id;
    }.bind(this));
  },
  deleteTrack: function (id) {
    tracksApi.deleteTrack(id).then(this.checkAuthState);
    this.state.currentTrack = null;
    this.setState(this.state);
  },
  handleSaveTrack: function (e) {
    e.preventDefault();
    e.stopPropagation();
    tracksApi.saveTrack(this.state.currentTrack, this.state.trackId).then(function (response) {
      window.history.pushState({}, response.track.name, '/#/items/' + response.id);
      this.checkAuthState();
    }.bind(this));
  },
  parseUrl: function (params) {
    if (params.length > 1) {
      if (params[1] === 'user') {
        console.log('user')
      } else {
        this.loadTrack(params[2]);
      }
    }
  },
  checkAuthState: function () {
    auth.check()
      .then(this.setAsAuthenticated)
      .catch(this.setAsUnauthenticated);
  },
  setAsAuthenticated: function (resp) {
    this.state.authenticated = true;
    this.state.userData = resp.user;
    this.state.userTracks = resp.items;
    this.setState(this.state);
  },
  setAsUnauthenticated: function (resp) {
    this.state.authenticated = false;
    this.state.loginOptions = resp.login;
    this.setState(this.state);
  },
  logout: function () {
    auth.logout().then(this.checkAuthState);
  },
  login: function (serviceName, url) {
    auth.login(serviceName, url).then(this.checkAuthState);
  },
  updateVolume: function (patternId, beatId, lineId, noteId, volume) {
    TrackWrapper.updateNoteVolume(patternId, beatId, lineId, noteId, volume);
    this.state.currentTrack.getPattern(patternId).getBeat(beatId).lines[lineId].setNoteVolume(noteId, volume);
    this.setState(this.state);
  },
  canPlay: function () {
    return this.state.initialized
        && this.state.currentTrack
        && this.state.currentTrack.patterns.length
        && this.state.currentTrack.patterns[0].beats.length
        && this.state.currentTrack.patterns[0].beats[0].lines.length;
  },
  compileTrack: function (event) {
    event.preventDefault();
    event.stopPropagation();
    compileTrack(this.state.currentTrack);
  },
  play: function () {
    console.profile('react');
    TrackWrapper.startPlayback();
  },
  stop: function () {
    TrackWrapper.stopPlayback();
    console.profileEnd('react');
  },
  render: function () {
    return (
      <div className="App">
        <Header
          onDeleteTrack={this.deleteTrack}
          onLoadTrack={this.loadTrack}
          userTracks={this.state.userTracks}
          loginOptions={this.state.loginOptions}
          onLogin={this.login}
          onLogout={this.logout}
          authenticated={this.state.authenticated}
          onSaveTrack={this.handleSaveTrack}
          onNewTrack={this.handleNewTrack}/>
        {this.state.currentTrack
          ? <Editor
          track={this.state.currentTrack}
          onUpdateTrack={this.setTrack}/>
          : void 0
        }
        {this.state.currentTrack
          ? <NotesComponent
              updateVolume={this.updateVolume}
              data={this.state.currentTrack}/>
          : void 0
        }
        <PlayButton
          play={this.play}
          stop={this.stop}
          compile={this.compileTrack}
          canPlay={this.canPlay}/>
      </div>
    );
  }
});
