'use strict';

var React = require('react/addons');
var NameInput = require('components/NameInput');
var TempoComponent = require('components/TempoComponent');
var BeatForm = require('./BeatForm');


var PatternForm = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data,
      customTempoVal: Number(this.props.data.tempo),
      linesData: [],
      backup: this.props.data.clone(),
      defaultBeat: this.props.data.createBeat(4, 4)
    };
  },
  cancel: function (e) {
    e.preventDefault();
    this.state.data = this.state.backup;
    this.setState(this.state);
    this.props.onCancel(this.state.data);
  },
  handleSubmit: function (e) {
    e.preventDefault();
    //this.updateLines();
    //this.state.linesData.map(function (lineData) {
    //  this.state.data.addLine(lineData.bufferIdx, lineData.subDivision);
    //}.bind(this));
    this.props.onSubmit(this.state.data);
  },
  handleNameChange: function (newName) {
    if (newName !== this.state.data.defaultName) {
      this.state.data.name = newName;
      this.setState(this.state);
    }
  },
  handleLoopsChange: function (loops) {
    this.state.data.setCounter(loops);
    this.setState(this.state);
  },
  handleTempoChange: function (newTempo) {
    this.state.data.tempo = newTempo;
    this.setState(this.state);
  },
  toggleTempoForm: function () {
    var checked = this.refs.tempoForm.getDOMNode().checked;
    if (checked) {
      this.state.customTempoVal = this.props.trackTempo;
      this.state.data.customTempo = true;
    } else {
      this.state.data.tempo = this.props.trackTempo;
      this.state.data.customTempo = false;
    }
    this.setState(this.state);
  },
  getTempo: function () {
    return this.state.data.tempoIsCustom ? this.state.customTempoVal : this.props.data.tempo;
  },
  render: function () {
    return (
      <form className='PatternForm' onSubmit={this.handleSubmit}>
        <div className="head-wrapper">
          <NameInput onNameChange={this.handleNameChange} val={this.state.data.name}/>
          <input type="checkbox" checked={this.state.data.customTempo} ref='tempoForm' onChange={this.toggleTempoForm}/>
          {
            this.state.data.customTempo
              ? <TempoComponent onValueChange={this.handleTempoChange} data={this.getTempo()}/>
              : <span>{this.state.data.tempo}</span>
          }
          <div className="clear"></div>
        </div>
        <BeatForm
          newTrack={this.props.newTrack}
          data={this.state.defaultBeat}/>
        <div className="submit">
          <a href="#" onClick={this.cancel} className='cancel'>Cancel</a>
          <input type="submit" value='Save pattern'/>
        </div>
      </form>
    );
  }
});

module.exports = PatternForm;
