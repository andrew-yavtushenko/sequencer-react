'use strict';

var React = require('react/addons');
var CounterComponent = require('./CounterComponent');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      data: {
        min: 40,
        max: 300,
        val: this.props.data,
        label: 'BPM:',
        name: 'Tempo'
      }
    };
  },
  render: function () {
    return (
      <CounterComponent onValueChange={this.props.onValueChange} data={this.state.data}/>
    );
  }
});
