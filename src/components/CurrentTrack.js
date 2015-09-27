'use strict';

var React = require('react/addons');
// var TrackWrapper = require('./TrackWrapper');
var Tempo = require('./Tempo');
var PatternForm = require('./PatternForm');
var PatternList = require('./PatternList');

var CurrentTrack = React.createClass({
  getInitialState: function () {
    return {
      data: {
        patterns: []
      },
      showNameInput: false,
      showPatternForm: false
    };
  },
  handleNewTrackName: function (e) {
    e.preventDefault();
    var newName = this.refs.newTrackName.getDOMNode().value.trim();
    if ((/^[a-zA-Z0-9\s]+$/gi).test(newName)) {
      this.props.onTrackNameChange(newName);
      this.state.showNameInput = false;
      this.setState(this.state);
    }
  },
  handleNameClick: function (e) {
    e.preventDefault();
    this.state.showNameInput = true;
    this.setState(this.state);
    setTimeout(function () {
      this.refs.newTrackName.getDOMNode().value = this.props.data.name;
      this.refs.newTrackName.getDOMNode().focus();
    }.bind(this), 0);
  },
  handleTempoChange: function (tempo) {
    this.props.onTrackTempo(tempo);
  },
  handlePatternsUpdate: function (data) {
    this.hideForm();
    this.state.data = this.props.onNewPattern(data);
    this.setState(this.state);
  },
  showForm: function () {
    this.state.showForm = true;
    this.setState(this.state);
  },
  hideForm: function (e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    this.state.showForm = false;
    this.setState(this.state);
  },
  render: function () {
    if (this.props.data === null) {
      return (
        <h3>No track selected</h3>
      );
    } else {
      return (
        <div className='CurrentTrack'>
          <div className='TrackTitle'>
            <span className='title-label'>Track Title:</span>
            {this.state.showNameInput ?
              <form className='trackName' onSubmit={this.handleNewTrackName}>
                <input type="text" onBlur={this.handleNewTrackName} ref='newTrackName'/>
              </form> :
              <span className='title' onClick={this.handleNameClick.bind(this)}>{this.props.data.name}</span>
            }
            <ul className='controls'>
              <li>
                <Tempo onTempoChange={this.handleTempoChange}/>
              </li>
              <li>
                <a href="#" onClick={this.showForm} className='create-pattern'>Add new pattern</a>
              </li>
            </ul>
            <div className="clear"></div>
          </div>
          <div id='PatternListWrapper' className={this.state.showForm ? 'with-form' : ''}>
            <PatternList patterns={this.state.data.patterns}/>
          </div>
          <div id="PatternFormWrapper" className={this.state.showForm ? '' : 'hidden'}>
            <PatternForm onSubmit={this.handlePatternsUpdate} hideForm={this.hideForm}/>
          </div>
        </div>
      );
    }
  }
});

module.exports = CurrentTrack;
