'use strict';

var React = require('react/addons');
var Settings = require('./Settings');
var Buffers = require('./Buffers');
var NameInput = require('./NameInput');
var CounterComponent = require('./CounterComponent');

var PatternForm = React.createClass({
  getInitialState: function () {
    return {
      data: {
        beat: 4,
        noteValue: 4,
        availableSubDivisions: Settings.subDivision,
        lines: [],
        defaultName: 'Untitled Pattern',
        name: '',
        customTempo: false,
        tempo: {
          min: 40,
          max: 300,
          val: 120,
          label: 'BPM:',
          name: 'Tempo'
        },
        loop: {
          min: 1,
          max: 1000000,
          val: 1,
          label: 'LOOPS:',
          name: 'Loops'
        }
      }
    };
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var newPatternData = this.state.data;
    this.updateLines();
    this.props.onSubmit(newPatternData);
    this.state.data.name = '';
    this.state.data.defaultName = 'Untitled Pattern';
    this.setState(this.state);
  },
  getBeats: function () {
    return Settings.beat.map(function (beat, key) {
      return <option key={key} value={beat}>{beat}</option>;
    });
  },
  getNoteValues: function () {
    return Settings.noteValue.map(function (noteValue, key) {
      return <option key={key} value={noteValue}>{noteValue}</option>;
    });
  },
  getSubDivisions: function () {
    return this.state.data.availableSubDivisions.map(function (value, key) {
      return (
        <option key={key} value={value}>{Settings.subDivisionNames[value]}</option>
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
      buffersArr.push(<option key={bufferName} value={bufferName}>{bufferName}</option>);
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
        <li key={index}>
          <select className='buffer' ref={'lineBuffer-' + index} value={line.buffer} onChange={this.changeLine('buffer', index)}>
            {this.getBuffersSelect()}
          </select>
          <select className='subDiv' ref={'lineSubDivision-' + index} value={line.subDivision} onChange={this.changeLine('subDivision', index)}>
            {this.getSubDivisions()}
          </select>
          <button className='remove-line' onClick={this.removeLine(index)}>&times;</button>
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
  handleNameChange: function (newName) {
    if (newName !== this.state.data.defaultName) {
      this.state.data.name = newName;
      this.setState(this.state);
    }
  },
  handleLoopsChange: function (loops) {
    console.log(loops);
  },
  handleTempoChange: function (newTempo) {
    console.log(newTempo);
  },
  render: function () {
    return (
      <form className='PatternForm' onSubmit={this.handleSubmit}>
        <div className="head-wrapper">
          <NameInput onNameChange={this.handleNameChange} val={this.state.data.defaultName}/>
          <CounterComponent onValueChange={this.handleTempoChange} data={this.state.data.tempo}/>
          <div className="clear"></div>
        </div>
        <div className="time-signature">
          <label>Time signature</label>
          <select ref='beat' value={this.state.data.beat} onChange={this.updateBeat}>
            {this.getBeats()}
          </select>
          <span className="divider">/</span>
          <select ref='noteValue' value={this.state.data.noteValue} onChange={this.updateSubDivisions}>
            {this.getNoteValues()}
          </select>
        </div>
        <div className='lines'>
          {this.getLines()}
        </div>
        <div className="lineAndLoop">
          <button onClick={this.addLine}>Add Line</button>
          <CounterComponent onValueChange={this.handleLoopsChange} data={this.state.data.loop}/>
          <div className="clear"></div>
        </div>
        <div className="submit">
          <a href="#" onClick={this.props.hideForm} className='cancel'>Cancel</a>
          <input type="submit" value='Save pattern'/>
        </div>
      </form>
    );
  }
});

module.exports = PatternForm;
