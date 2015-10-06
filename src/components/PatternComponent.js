'use strict';

var React = require('react/addons');
var Settings = require('./Settings');
var PatternForm = require('./PatternForm');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      showForm: false,
      data: this.props.data
    };
  },
  showEditForm: function () {
    this.state.showForm = true;
    this.setState(this.state);
  },
  duplicate: function () {
    this.props.duplicate(this.state.data);
  },
  hideForm: function (data) {
    this.state.data = data;
    this.state.showForm = false;
    this.setState(this.state);
  },
  handleSubmit: function (data) {
    this.hideForm(data);
    this.props.handlePatternsUpdate(data);
  },
  render: function () {
    return (
      <li key={this.props.patternKey}>
        {this.state.showForm ?
          <PatternForm
            trackTempo={this.props.trackTempo}
            data={this.state.data}
            newTrack={false}
            onSubmit={this.handleSubmit}
            hideForm={this.hideForm}/> :
          <div className="inner">
            {this.state.data.name}&nbsp;&nbsp;{this.state.data.beat}/{this.state.data.noteValue}
            <div className="custom">
              {this.state.data.customTempo ?
                <span>custom</span> :
                <span>general</span>
              }
            </div>
            <div className="tempo">{this.state.data.tempo}</div>
            <div className="duplicate">
              <a href="#" onClick={this.props.duplicate}>duplicate</a>
            </div>
            <div className="edit">
              <a href="#" onClick={this.showEditForm}>edit</a>
            </div>
            <ul>{
              this.state.data.lines.map(function (line, key){
                return <li key={key}>{line.bufferIdx + ' ' + Settings.subDivisionNames[line.subDivision]}</li>;
              })
            }</ul>
          </div>
        }
      </li>
    );
  }
});
