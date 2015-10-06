'use strict';

var React = require('react/addons');
var PatternForm = require('./PatternForm');
var PatternList = require('./PatternList');
var NameInput = require('./NameInput');
var TempoComponent = require('./TempoComponent');
var TrackWrapper = require('./TrackWrapper');

var CurrentTrack = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data,
      showNameInput: false,
      showPatternForm: false
    };
  },
  componentDidMount: function () {
    this.state.defaultPattern = TrackWrapper.createPattern(4, 4, '');
    this.setState(this.state);
  },
  handleTempoChange: function (tempo) {
    this.props.onTrackTempo(tempo);
  },
  handlePatternsUpdate: function (data) {
    this.hideForm();
    this.props.onNewPattern(data, function (currentTrack) {
      this.state.data = currentTrack;
      this.setState(this.state);
    }.bind(this));
  },
  showForm: function () {
    this.state.defaultPattern = TrackWrapper.createPattern(4, 4, '');
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
  duplicatePattern: function (pattern) {
    this.props.handlePatternDuplicate(pattern);
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
                <TempoComponent onValueChange={this.handleTempoChange} data={this.props.data.tempo}/>
              </li>
              <li>
                <a href="#" onClick={this.showForm} className='create-pattern'>Add new pattern</a>
              </li>
            </ul>
            <div className="clear"></div>
          </div>
          <div id='PatternListWrapper' className={this.state.showForm ? 'with-form' : ''}>
            <PatternList
              trackTempo={this.state.data.tempo}
              patterns={this.state.data.patterns}
              handlePatternSort={this.props.handlePatternSort}
              handlePatternDuplicate={this.duplicatePattern}
              handlePatternsUpdate={this.handlePatternsUpdate}/>
          </div>
          <div id="PatternFormWrapper" className={this.state.showForm ? '' : 'hidden'}>
            {this.state.showForm ?
              <PatternForm
                data={this.state.defaultPattern}
                trackTempo={this.state.data.tempo}
                newTrack={true}
                onSubmit={this.handlePatternsUpdate}
                hideForm={this.hideForm}/> :
              <span>nope</span>
            }
          </div>
        </div>
      );
    }
  }
});

module.exports = CurrentTrack;
