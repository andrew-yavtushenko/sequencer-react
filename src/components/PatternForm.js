'use strict';

var React = require('react/addons');
var Settings = require('./Settings');
var Buffers = require('./Buffers');

var PatternForm = React.createClass({
  getInitialState: function () {
    return {
      data: {
        beat: 4,
        noteValue: 4,
        availableSubDivisions: Settings.subDivision,
        lines: []
      }
    };
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var newPatternData = this.state.data;
    this.updateLines();
    //this.state.data.lines.map(function (line) {
    //  console.log(line);
    //});
    this.props.onSubmit(newPatternData);
  },
  getBeats: function () {
    return Settings.beat.map(function (beat) {
      var option = beat === this.state.data.beat ?
        <option value={beat}>{beat}</option> :
        <option value={beat}>{beat}</option>;
      return (
        {option}
      );
    }.bind(this));
  },
  getNoteValues: function () {
    return Settings.noteValue.map(function (noteValue) {
      var option = noteValue === this.state.data.noteValue ?
        <option value={noteValue}>{noteValue}</option> :
        <option value={noteValue}>{noteValue}</option>;
      return (
        {option}
      );
    }.bind(this));
  },
  getSubDivisions: function () {
    return this.state.data.availableSubDivisions.map(function (value) {
      return (
        <option value={value}>{Settings.subDivisionNames[value]}</option>
      );
    });
  },
  updateSubDivisions: function () {
    var noteValue = parseInt.call(null, this.refs.noteValue.getDOMNode().value);
    var subdivisions = Settings.subDivision.reduce(function (result, subDivision) {
      if (subDivision >= noteValue) {
        result.push(subDivision);
      }
      return result;
    }, []);

    this.state.data.availableSubDivisions = subdivisions;
    this.state.data.noteValue = noteValue;
    this.setState(this.state);
  },
  updateLines: function () {
    this.state.data.lines.map(function (line, index) {
      this.state.data.lines[index].subDivision = parseInt.call(null, this.refs['lineSubDivision-' + index].getDOMNode().value);
    }.bind(this));
    this.setState(this.state);
  },
  getBuffersSelect: function () {
    var buffersArr = [];
    var buffers = Buffers.get();
    for (var bufferName in buffers) {
      buffersArr.push(<option value={bufferName}>{bufferName}</option>);
    }
    return buffersArr;
  },
  componentDidMount: function () {
    this.updateSubDivisions();
    this.createLine('hihat', this.state.data.availableSubDivisions[0]);
    this.createLine('snare', this.state.data.availableSubDivisions[0]);
    this.createLine('kick', this.state.data.availableSubDivisions[0]);
  },
  changeLine: function (field, index){
    return function (event) {
      var parsed = parseInt.call(null, event.target.value);
      var val = isNaN(parsed) ? event.target.value : parsed;

      this.state.data.lines[index][field] = val;
      this.setState(this.state);
    }.bind(this);
  },
  removeLine: function (index){
    return function (event) {
      event.preventDefault();
      this.state.data.lines.splice(index, 1);
      this.setState(this.state);
    }.bind(this);
  },
  getLines: function (){
    var lines = this.state.data.lines.map(function (line, index) {
      return (
        <li>
          <select ref={'lineBuffer-' + index} value={line.buffer} onChange={this.changeLine('buffer', index)}>
            {this.getBuffersSelect()}
          </select>
          <select ref={'lineSubDivision-' + index} value={line.subDivision} onChange={this.changeLine('subDivision', index)}>
            {this.getSubDivisions()}
          </select>
          <button onClick={this.removeLine(index)}>&times;</button>
        </li>
      );
    }.bind(this));
    return lines.length ? <ul>{lines}</ul> : <span></span>;
  },
  addLine: function (e) {
    e.preventDefault();
    this.getLines();
    this.createLine('hihat', this.state.data.availableSubDivisions[0]);
  },
  createLine: function (buffer, subDivision) {
    var newLine = {
      buffer: buffer,
      subDivision: subDivision
    };
    this.state.data.lines.push(newLine);
    this.setState(this.state);
  },
  updateBeat: function() {
    var beat = parseInt.call(null, this.refs.beat.getDOMNode().value);
    this.state.data.beat = beat;
    this.setState(this.state);
  },
  render: function () {
    return (
      <form className='PatternForm' onSubmit={this.handleSubmit}>
        <a href="#" onClick={this.props.hideForm}>&times;</a>
        <select ref='beat' value={this.state.data.beat} onChange={this.updateBeat}>
          {this.getBeats()}
        </select>
        <select ref='noteValue' value={this.state.data.noteValue} onChange={this.updateSubDivisions}>
          {this.getNoteValues()}
        </select>
        <div className='lines'>
          {this.getLines()}
        </div>
        <button onClick={this.addLine}>Add Line</button>
        <input type="submit" value='Create new pattern'/>
      </form>
    );
  }
});

module.exports = PatternForm;
