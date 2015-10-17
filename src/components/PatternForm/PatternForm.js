'use strict';

var React = require('react/addons');
var Settings = require('components/Settings');
var Buffers = require('components/Buffers');
var NameInput = require('components/NameInput');
var TempoComponent = require('components/TempoComponent');
var LoopsComponent = require('components/LoopsComponent');


var PatternForm = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data,
      customTempoVal: Number(this.props.data.tempo),
      linesData: [],
      backup: this.props.data.clone()
    };
  },
  componentDidMount: function () {
    this.updateSubDivisions();
    if (this.props.newTrack) {
      this.createLine('hat', this.state.data.availableSubDivisions[0]);
      this.createLine('snare', this.state.data.availableSubDivisions[0]);
      this.createLine('kick', this.state.data.availableSubDivisions[0]);
    }
  },
  cancel: function (e) {
    e.preventDefault();
    this.state.data = this.state.backup;
    this.setState(this.state);
    this.props.onCancel(this.state.data);
  },
  handleSubmit: function (e) {
    e.preventDefault();
    this.updateLines();
    this.state.linesData.map(function (lineData) {
      this.state.data.addLine(lineData.bufferIdx, lineData.subDivision);
    }.bind(this));
    this.props.onSubmit(this.state.data);
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
    this.state.linesData.map(function (line, index) {
      this.state.linesData[index].subDivision = parseInt(this.refs['lineSubDivision-' + index].getDOMNode().value);
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
  removeLineData: function (index){
    return function (event) {
      event.preventDefault();
      this.state.linesData.splice(index, 1);
      this.setState(this.state);
    }.bind(this);
  },
  removeLine: function (line, index, event) {
    event.preventDefault();
    this.state.data.lines.splice(index, 1);
    this.setState(this.state);
  },
  changeSubDivision: function (index, event) {
    var val = parseInt(event.target.value);
    this.state.linesData[index].subDivision = val;
    this.setState(this.state);
  },
  changeBuffer: function (index, event) {
    this.state.linesData[index].bufferIdx = event.target.value;
    this.setState(this.state);
  },
  getLines: function (){
    var lines = this.state.linesData.map(function (line, index) {
      return (
        <li key={index}>
          <select className='bufferIdx' ref={'lineBuffer-' + index} value={line.bufferIdx} onChange={this.changeBuffer.bind(this, index)}>
            {this.getBuffersSelect()}
          </select>
          <select className='subDiv' ref={'lineSubDivision-' + index} value={line.subDivision} onChange={this.changeSubDivision.bind(this, index)}>
            {this.getSubDivisions()}
          </select>
          <button className='remove-line' onClick={this.removeLineData(index)}>&times;</button>
        </li>
      );
    }.bind(this));
    return lines.length ? <ul>{lines}</ul> : <span></span>;
  },
  addLine: function (e) {
    e.preventDefault();
    this.getLines();
    this.createLine('hat', this.state.data.availableSubDivisions[0]);
  },
  createLine: function (bufferIdx, subDivision) {
    this.state.linesData.push({
      bufferIdx: bufferIdx,
      subDivision: subDivision
    });
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
    this.state.data.tempo = newTempo;
    this.setState(this.state);
  },
  toggleTempoForm: function () {
    var checked = this.refs.tempoForm.getDOMNode().checked;
    if (checked) {
      this.state.customTempoVal = this.props.trackTempo;
      this.state.data.tempoIsCustom = true;
    } else {
      this.state.data.tempo = this.props.trackTempo;
      this.state.data.tempoIsCustom = false;
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
          <input type="checkbox" checked={this.state.data.tempoIsCustom} ref='tempoForm' onChange={this.toggleTempoForm}/>
          {
            this.state.data.tempoIsCustom
              ? <TempoComponent onValueChange={this.handleTempoChange} data={this.getTempo()}/>
              : <span>{this.state.data.tempo}</span>
          }
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
        <ul>
          {
            this.state.data.lines.map(function (line, index) {
              return (
                <li key={index}>
                  <span>{line.bufferIdx}</span>
                  <span>{Settings.subDivisionNames[line.subDivision]}</span>
                  <button className='remove-line' onClick={this.removeLine.bind(this, line, index)}>&times;</button>
                </li>
              );
            }.bind(this))
          }
        </ul>
        <div className='lines'>
          {this.getLines()}
        </div>
        <div className="lineAndLoop">
          <button onClick={this.addLine}>Add Line</button>
          <LoopsComponent onValueChange={this.handleLoopsChange} data={this.props.data.loops}/>
          <div className="clear"></div>
        </div>
        <div className="submit">
          <a href="#" onClick={this.cancel} className='cancel'>Cancel</a>
          <input type="submit" value='Save pattern'/>
        </div>
      </form>
    );
  }
});

module.exports = PatternForm;
