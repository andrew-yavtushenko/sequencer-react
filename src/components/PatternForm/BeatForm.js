var React = require('react/addons');
var Settings = require('components/Settings');
var Buffers = require('components/Buffers');
//var TempoComponent = require('components/TempoComponent');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data
    };
  },
  componentDidMount: function () {
    if (this.props.newTrack) {
      this.updateSubDivisions();
      this.createLine('hat', this.state.data.availableSubDivisions[0]);
      this.createLine('snare', this.state.data.availableSubDivisions[0]);
      this.createLine('kick', this.state.data.availableSubDivisions[0]);
    }
  },
  updateBeat: function() {
    this.state.data.beat = parseInt(this.refs.beat.getDOMNode().value);
    this.setState(this.state);
  },
  updateSubDivisions: function () {
    var noteValue = parseInt(this.refs.noteValue.getDOMNode().value);

    this.state.data.noteValue = noteValue;
    this.state.data.availableSubDivisions = Settings.getAvailableSubDivisions(noteValue);

    for (var i = 0; i < this.state.data.lines.length; i++) {
      this.state.data.updateLine(i, 'subDivision', this.state.data.availableSubDivisions[0]);
    }

    this.setState(this.state);
  },
  getSubDivisions: function () {
    return this.state.data.availableSubDivisions.map(function (value, key) {
      return (
        <option key={key} value={value}>{Settings.subDivisionNames[value]}</option>
      );
    });
  },
  getBuffersSelect: function () {
    var buffersArr = [];
    var buffers = Buffers.get();
    for (var bufferName in buffers) {
      buffersArr.push(<option key={bufferName} value={bufferName}>{bufferName}</option>);
    }
    return buffersArr;
  },
  removeLine: function (index, event) {
    event.preventDefault();
    this.state.data.removeLine(index);
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
  addLine: function (e) {
    e.preventDefault();
    this.createLine('hat', this.state.data.availableSubDivisions[0]);
  },
  createLine: function (bufferIdx, subDivision) {
    this.state.data.addLine(bufferIdx, subDivision);
    this.setState(this.state);
  },
  changeSubDivision: function (lineIndex, event) {
    var val = parseInt(event.target.value);
    this.state.data.updateLine(lineIndex, 'subDivision', val);
    this.setState(this.state);
  },
  changeBuffer: function (lineIndex, event) {
    this.state.data.updateLine(lineIndex, 'bufferIdx', event.target.value);
    this.setState(this.state);
  },
  renderLine: function (line, index) {
    return (
      <li key={index} className="beatLine">
        <select className='bufferIdx' ref={'lineBuffer-' + index} value={line.bufferIdx} onChange={this.changeBuffer.bind(this, index)}>
          {this.getBuffersSelect()}
        </select>
        <select className='subDiv' ref={'lineSubDivision-' + index} value={line.subDivision} onChange={this.changeSubDivision.bind(this, index)}>
          {this.getSubDivisions()}
        </select>
        <button className='remove-line' onClick={this.removeLine.bind(this, index)}>&times;</button>
      </li>
    );
  },
  render: function () {
    return (
      <div className="beatData">
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
        <ul className='lines'>
          {this.state.data.lines.map(this.renderLine)}
        </ul>
        <div className="lineAndLoop">
          <button onClick={this.addLine}>Add Line</button>
          <div className="clear"></div>
        </div>
      </div>
    );
  }
});
