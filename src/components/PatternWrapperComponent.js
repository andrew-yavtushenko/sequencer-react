'use strict';

var React = require('react/addons');
var PatternComponent = require('./PatternComponent');
var LoopsComponent = require('./LoopsComponent');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      showForm: false
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
    console.log(counter);
  },
  deletePattern: function (patternId) {
    this.props.onDeletePattern(patternId);
  },
  render: function () {
    return (
      <ul className='loopPatterns'>
        <div>
          <LoopsComponent onValueChange={this.handleLoopsChange} data={this.props.data.counter}/>
          <div className="handle">handle</div>
          <div className="custom">
            { this.props.data.customTempo
              ? <span>custom</span>
              : <span>general</span> }
          </div>
          <div className="tempo">{this.props.data.tempo}</div>
          <div className="duplicate">
            <a href="#" onClick={this.props.duplicate}>duplicate</a>
          </div>
          <div className="edit">
            <a href="#" onClick={this.showEditForm}>edit</a>
          </div>
          <div className="delete">
            <a href="#" onClick={this.deletePattern.bind(this, this.props.data.id)}>delete</a>
          </div>
        </div>
        {this.props.data.beats.map(function (pattern, patternKey) {
          return (
            <li key={patternKey}>
              <PatternComponent
                trackTempo={this.props.trackTempo}
                newTrack={false}
                onCancel={this.props.onCancel}
                onPatternUpdate={this.props.onPatternUpdate}
                duplicate={this.props.duplicate}
                onDeletePattern={this.props.onDeletePattern}
                data={pattern}/>
            </li>
          );
        }.bind(this))}
      </ul>
    );
  }
});
