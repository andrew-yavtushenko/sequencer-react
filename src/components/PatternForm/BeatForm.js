var React = require('react/addons');
var Settings = require('components/Settings');
var Buffers = require('components/Buffers');
//var TempoComponent = require('components/TempoComponent');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data,
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
  updateBeat: function() {
    this.state.data.beat = parseInt(this.refs.beat.getDOMNode().value);
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
  getLinesData: function () {
    return this.state.linesData.map(function (line, index) {
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
  },
  getLines: function () {
    return this.state.data.lines.map(function (line, index) {
      return (
        <li key={index}>
          <span>{line.bufferIdx}</span>
          <span>{Settings.subDivisionNames[line.subDivision]}</span>
          <button className='remove-line' onClick={this.removeLine.bind(this, line, index)}>&times;</button>
        </li>
      );
    }.bind(this));
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
        <ul>{
            this.state.data.lines
            ? this.getLines()
            : void 0}
        </ul>
        <div className='lines'>
          {this.getLinesData()}
        </div>
        <div className="lineAndLoop">
          <button onClick={this.addLine}>Add Line</button>
          <div className="clear"></div>
        </div>
      </div>
    );
  }
});
