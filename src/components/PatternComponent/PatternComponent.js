'use strict';

var React = require('react/addons');
var Settings = require('components/Settings');
var PatternForm = require('components/PatternForm');

var PatternComponent = React.createClass({
  displayName: 'PatternComponent',
  getInitialState: function () {
    return {
      showForm: false
    };
  },
  render: function () {
    return (
      this.state.showForm ?
        <PatternForm
          trackTempo={this.props.trackTempo}
          data={this.props.data}
          newTrack={false}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmit}
          hideForm={this.hideForm}/> :
        <div className="inner">
          {this.props.data.name}&nbsp;&nbsp;{this.props.data.beat}/{this.props.data.noteValue}
          <ul>
            {
              this.props.data.lines.map(function (line, key){
                return <li key={key}>{line.bufferIdx + ' ' + Settings.subDivisionNames[line.subDivision]}</li>;
              })
            }
          </ul>
        </div>
    );
  }
});

module.exports = PatternComponent;
