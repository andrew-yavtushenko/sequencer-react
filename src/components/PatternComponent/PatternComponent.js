'use strict';

var React = require('react/addons');
var Settings = require('components/Settings');
var PatternForm = require('components/PatternForm');
var ContextMenuWrapper = require('components/ContextMenu/ContextMenuWrapper');
require('./PatternComponent.css');

var PatternComponent = React.createClass({
  displayName: 'PatternComponent',
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
  deletePattern: function (patternId) {
   this.props.onDeletePattern(patternId);
  },
  render: function () {
    return (
      <li className="pattern-component" key={this.props.patternKey}>
        {this.state.showForm ?
          <PatternForm
            trackTempo={this.props.trackTempo}
            data={this.props.data}
            newTrack={false}
            onCancel={this.handleCancel}
            onSubmit={this.handleSubmit}
            hideForm={this.hideForm}/> :
          <div className="inner">
            {this.props.data.name}&nbsp;&nbsp;{this.props.data.beat}/{this.props.data.noteValue}
            <div className="custom">
              { this.props.data.customTempo
                ? <span>custom</span>
                : <span>general</span> }
            </div>
            <div className="tempo">{this.props.data.tempo}</div>
            <ContextMenuWrapper popupClass="PatternContextMenu" data={this.props.data} actions={this.props.actions}>
              <div className="actions"></div>
            </ContextMenuWrapper>
            <div className="duplicate">
              <a href="#" onClick={this.props.duplicate}>duplicate</a>
            </div>
            <div className="edit">
              <a href="#" onClick={this.showEditForm}>edit</a>
            </div>
            <div className="delete">
              <a href="#" onClick={this.deletePattern.bind(this, this.props.data.id)}>delete</a>
            </div>
            <ul>
              {
                this.props.data.lines.map(function (line, key){
                  return <li key={key}>{line.bufferIdx + ' ' + Settings.subDivisionNames[line.subDivision]}</li>;
                })
              }
            </ul>
          </div>
        }
      </li>
    );
  }
});

module.exports = PatternComponent;
