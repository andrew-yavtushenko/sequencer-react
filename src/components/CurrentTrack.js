'use strict';

var React = require('react/addons');
// var TrackWrapper = require('./TrackWrapper');
var CounterComponent = require('./CounterComponent');
var PatternForm = require('./PatternForm');
var PatternList = require('./PatternList');
var NameInput = require('./NameInput');

var CurrentTrack = React.createClass({
  getInitialState: function () {
    return {
      data: {
        patterns: []
      },
      showNameInput: false,
      showPatternForm: false,
      tempo: {
        min: 40,
        max: 300,
        val: 120,
        label: 'BPM:',
        name: 'Tempo'
      }
    };
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
            <NameInput onNameChange={this.props.onTrackNameChange} val={this.props.data.name}/>
            <ul className='controls'>
              <li>
                <CounterComponent onValueChange={this.handleTempoChange} data={this.state.tempo}/>
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
