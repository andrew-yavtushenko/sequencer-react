'use strict';

var React = require('react/addons');
var PatternComponent = require('./PatternComponent');
var LoopsComponent = require('./LoopsComponent');

module.exports = React.createClass({
  renderPattern: function (pattern) {
    return (
      <PatternComponent
        trackTempo={this.props.trackTempo}
        newTrack={false}
        onCancel={this.props.onCancel}
        onPatternUpdate={this.props.onPatternUpdate}
        duplicate={this.props.duplicate}
        onDeletePattern={this.props.onDeletePattern}
        data={pattern}/>
    );
  },
  handleLoopsChange: function (counter) {
    console.log(counter);
  },
  renderLoop: function () {
    return (
      <ul className='loopPatterns'>
        <div>
          {this.props.data.id}
          <LoopsComponent onValueChange={this.handleLoopsChange} data={this.props.data.counter}/>
        </div>
        {this.props.data.patterns.map(function (pattern) {
          return (
            <li>
              {this.renderPattern(pattern)}
            </li>
          );
        }.bind(this))}
      </ul>
    );
  },
  render: function () {
    return (
      <li className={this.props.data.isLoop ? 'loop' : void 0}>
        {this.props.data.isLoop ?
          this.renderLoop() :
          this.renderPattern(this.props.data)
        }
      </li>
    );
  }
});
