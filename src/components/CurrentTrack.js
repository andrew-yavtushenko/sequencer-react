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
      showNameInput: false,
      showPatternForm: false
    };
  },
  componentDidMount: function () {
    this.state.defaultPattern = TrackWrapper.createPattern(4, 4, '');
    this.setState(this.state);
  },
  handlePatternCreate: function (data) {
    this.hideForm();
    this.props.onNewPattern(data);
  },
  handlePatternUpdate: function (pattern) {
    this.hideForm();
    this.props.onPatternUpdate(pattern);
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
  handleTempoChange: function (tempo) {
    this.state.defaultPattern.setTempo(tempo);
    this.setState(this.state);
    this.props.onTempoChange(tempo);
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
              trackTempo={this.props.data.tempo}
              patterns={this.props.data.patterns}
              onPatternMove={this.props.onPatternMove}
              onPatternDuplicate={this.props.onPatternDuplicate}
              onDeletePattern={this.props.onDeletePattern}
              onPatternUpdate={this.props.onPatternUpdate}/>
          </div>
          <div id="PatternFormWrapper" ref='newPatternForm'>
            { this.state.showForm ?
              <PatternForm
                trackTempo={this.props.data.tempo}
                data={this.state.defaultPattern}
                newTrack={true}
                onCancel={this.hideForm}
                onSubmit={this.handlePatternCreate}
                hideForm={this.hideForm}/>
              : void 0 }
          </div>
        </div>
      );
    }
  }
});

module.exports = CurrentTrack;
