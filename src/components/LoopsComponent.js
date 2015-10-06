'use strict';

var React = require('react/addons');
var CounterComponent = require('./CounterComponent');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      data: {
        min: 1,
        max: 1000000,
        val: this.props.data,
        label: 'LOOPS:',
        name: 'Loops'
      }
    };
  },
  render: function () {
    return (
      <CounterComponent onValueChange={this.props.onValueChange} data={this.state.data}/>
    );
  }
});
