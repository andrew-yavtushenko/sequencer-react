'use strict';

var React = require('react/addons');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      showLibrary: false
    };
  },
  hideLibrary: function (e) {
    e.preventDefault();
    this.state.showLibrary = false;
    this.setState(this.state);
    window.removeEventListener('click', this.hideLibrary);
  },
  showLibrary: function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.state.showLibrary = true;
    this.setState(this.state);
    window.addEventListener('click', this.hideLibrary);
  },
  login: function (service, e) {
    e.preventDefault();
    this.props.onLogin(service.name, service.url);
  },
  renderLoginOptions: function () {
    return (
    <ul className="nav nav-right">{
      this.props.loginOptions.map(function (option, key) {
        return (
          <li key={key}>{
            <a href="#" onClick={this.login.bind(this, option)}>{option.name}</a>
          }</li>
        );
      }.bind(this))
    }</ul>
    );
  },
  loadTrack: function (track) {
    window.history.pushState({}, track.title, '/#/items/' + track.id);
    this.props.onLoadTrack(track.id);
  },
  deleteTrack: function (track) {
    window.history.pushState({}, 'New tracl', '/#');
    this.props.onDeleteTrack(track.id);
  },
  renderLibrary: function () {
    return (
      <div className='list-wrapper'>
        <p>your saved tracks</p>
        <ul className="library">{
          this.props.userTracks.map(function (track, key) {
            return (
              <li key={key}>
                <a href="#" onClick={this.loadTrack.bind(this, track)}>{track.title}</a>
                <a href="#" onClick={this.deleteTrack.bind(this, track)}><small>delete</small></a>
              </li>
            );
          }.bind(this))
        }</ul>
      </div>
    );
  },
  render: function () {
    return (
      <div id='header'>
        <h1>sequencer</h1>
        <ul className="nav nav-left">
          <li>
            <a href="#" onClick={this.props.onNewTrack}>new track</a>
          </li>
          <li style={{display: this.props.authenticated ? 'inline-block' : 'none'}}>
            <a href="#" onClick={this.props.onSaveTrack}>save track</a>
          </li>
          <li style={{display: this.props.authenticated ? 'inline-block' : 'none'}}>
            <a href="#" onClick={this.showLibrary}>my library</a>
            {
              this.state.showLibrary
                ? this.renderLibrary()
                : void 0
            }
          </li>
        </ul>
        {
          this.props.authenticated
            ? <ul className="nav nav-right">
                <li>
                  <a href="#" onClick={this.props.onLogout}>logout</a>
                </li>
              </ul>
            : this.renderLoginOptions()
        }
        <div className="clear"></div>
      </div>
    );
  }
});
