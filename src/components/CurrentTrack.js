'use strict';

var React = require('react/addons');
var PatternForm = require('./PatternForm/');
var PatternList = require('./PatternList/');
var NameInput = require('./NameInput');
var TempoComponent = require('./TempoComponent');
var TrackWrapper = require('./TrackWrapper');

var CurrentTrack = React.createClass({
  getInitialState: function () {
    return {
      showNameInput: false,
      showPatternForm: false,
      loopStart: null,
      loopFinish: null
    };
  },
  updateLoopValues: function () {
    this.state.loopStart = this.props.data.patterns[0].id;
    this.state.loopFinish = this.props.data.patterns[0].id;
    this.setState(this.state);
  },
  componentDidMount: function () {
    this.state.defaultPattern = TrackWrapper.createPattern(4, 4, '');
    this.setState(this.state);
  },
  handlePatternCreate: function (data) {
    this.hideForm();
    this.props.onNewPattern(data);
    this.updateLoopValues();
  },
  showForm: function () {
    this.state.defaultPattern = TrackWrapper.createPattern('');
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
    this.state.defaultPattern.setGeneralTempo(tempo);
    this.setState(this.state);
    this.props.onTempoChange(tempo);
  },
  onCreateLoop: function () {
    var patternStart = this.props.data.getPattern(this.state.loopStart);
    var patternFinish = this.props.data.getPattern(this.state.loopFinish);

    var startIndex = this.props.data.patterns.indexOf(patternStart);
    var finishIndex = this.props.data.patterns.indexOf(patternFinish);
    var patternsToLoop = [];

    if (startIndex < finishIndex) {
      patternsToLoop = this.props.data.patterns.slice(startIndex, finishIndex + 1);
    } else {
      patternsToLoop = this.props.data.patterns.slice(finishIndex, startIndex + 1);
    }

    this.props.onCreateLoop(patternsToLoop);
  },
  handleLoopStartChange: function (e) {
    e.preventDefault();
    this.state.loopStart = e.target.value;
    this.setState(this.state);
  },
  handleLoopFinishChange: function (e) {
    e.preventDefault();
    this.state.loopFinish = e.target.value;
    this.setState(this.state);
  },
  handlePatternUpdate: function (pattern) {
    this.props.onPatternUpdate(pattern);
  },
  handleEditCancel: function (pattern) {
    this.props.data.updatePattern(pattern);
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
                <select value={this.state.loopStart} onChange={this.handleLoopStartChange}>
                  {
                    this.props.data.patterns.map(function (pattern, patternKey) {
                      return (
                        <option key={patternKey} value={pattern.id}>{pattern.name}</option>
                      );
                    })
                  }
                </select>
              </li>
              <li>
                <select value={this.state.loopFinish} onChange={this.handleLoopFinishChange}>
                  {
                    this.props.data.patterns.map(function (pattern, patternKey) {
                      return (
                        <option key={patternKey} value={pattern.id}>{pattern.name}</option>
                      );
                    })
                  }
                </select>
              </li>
              <li>
                <a href="#" onClick={this.onCreateLoop}>create loop</a>
              </li>
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
              onEditCancel={this.handleEditCancel}
              trackTempo={this.props.data.tempo}
              patterns={this.props.data.patterns}
              onPatternMove={this.props.onPatternMove}
              onPatternDuplicate={this.props.onPatternDuplicate}
              onPatternCounterChange={this.props.onPatternCounterChange}
              onDeletePattern={this.props.onDeletePattern}
              track={this.props.data}
              onPatternUpdate={this.handlePatternUpdate}/>
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
