'use strict';

var React = require('react/addons');
var PatternForm = require('components/PatternForm');
var BeatsComponent = require('./BeatsComponent');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      showForm: false,
      showDropDown: false
    };
  },
  showEditForm: function () {
    this.state.showForm = true;
    this.setState(this.state);
  },
  hideForm: function () {
    this.state.showForm = false;
    this.setState(this.state);
  },
  handleSubmit: function (pattern) {
    this.hideForm();
    this.props.onPatternUpdate(pattern);
  },
  handleCancel: function (pattern) {
    this.hideForm();
    this.props.onCancel(pattern);
  },
  handleLoopsChange: function (counter) {
    this.props.onCounterChange(this.props.data.id, counter);
  },
  deletePattern: function () {
    this.props.onDeletePattern(this.props.data.id);
  },
  handleTempoChange: function (newTempo) {
    this.props.data.setCustomTempo(newTempo);
    this.setState(this.state);
    this.props.onTempoChange(newTempo);
  },
  renderForm: function () {
    return (
      <PatternForm
        onTempoRelease={this.props.onTempoRelease}
        onTempoChange={this.handleTempoChange}
        onLoopsChange={this.handleLoopsChange}
        trackTempo={this.props.trackTempo}
        data={this.props.data}
        newTrack={false}
        onCancel={this.handleCancel}
        onSubmit={this.handleSubmit}
        hideForm={this.hideForm}/>
    );
  },
  handlePatternInsert: function (beat, position) {
    this.props.data.insertBeat(beat, position);
    this.setState(this.state);
    this.props.onPatternUpdate(this.props.data);
  },
  handlePatternRemove: function (beatId) {
    this.props.data.deleteBeat(beatId);
    if (this.props.data.beats.length === 0) {
      this.deletePattern();
    }
    this.props.onPatternUpdate(this.props.data);
    this.setState(this.state);
  },
  handlePatternMove: function (newIndex, oldIndex) {
    this.props.data.moveBeat(newIndex, oldIndex);
    this.setState(this.state);
    this.props.onPatternUpdate(this.props.data);
  },
  handleDuplicate: function () {
    this.props.duplicate(this.props.data.id);
  },
  hideDropDown: function () {
    this.state.showDropDown = false;
    this.setState(this.state);
    window.removeEventListener('click', this.hideDropDown);
  },
  showDropDown: function () {
    this.state.showDropDown = true;
    this.setState(this.state);
    window.addEventListener('click', this.hideDropDown);
  },
  renderPattern: function () {
    return (
      <div className="inner">
        <div className="handle patternTitle">{this.props.data.name}</div>
        <ul className="counters">
          {this.props.data.counter > 1
            ? <li><div className="loopsCounter">{this.props.data.counter} loops</div></li>
            : void 0}
          <li>
            <div className="tempo">Tempo: {this.props.data.tempo}</div>
          </li>
          <li className="clear"></li>
        </ul>
        <div className="dropDownWrapper">
          <a href="#" className="dropdownTrigger" onMouseEnter={this.showDropDown}></a>
          <div className="dropdownListWrapper" style={{display: this.state.showDropDown ? 'block' : 'none'}}>
            <ul className="dropdown">
              <li className="edit">
                <a href="#" onClick={this.showEditForm}>Edit pattern</a>
              </li>
              <li className="duplicate">
                <a href="#" onClick={this.handleDuplicate}>Duplicate pattern</a>
              </li>
              <li className="delete">
                <a href="#" onClick={this.deletePattern}>Delete pattern</a>
              </li>
            </ul>
          </div>
        </div>
        <BeatsComponent
          patternId={this.props.data.id}
          patternName={this.props.data.name}
          onSort={this.handleBeatsSort}
          onPatternInsert={this.handlePatternInsert}
          onPatternRemove={this.handlePatternRemove}
          onPatternMove={this.handlePatternMove}
          beats={this.props.data.beats}/>
      </div>
    );
  },
  render: function () {
    return (
      this.state.showForm
        ? this.renderForm()
        : this.renderPattern()
    );
  }
});
