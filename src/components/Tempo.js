'use strict';

var React = require('react/addons');

var Tempo = React.createClass({
  getInitialState: function () {
    return {
      data: {
        min: 40,
        max: 300,
        val: 120
      }
    };
  },
  handleChange: function (e) {
    e.preventDefault();
    var newValue = parseInt.call(null, React.findDOMNode(this.refs.tempo).value);
    if (!isNaN(newValue) && typeof newValue === 'number' && this.state.data.min <= newValue <= this.state.data.max) {
      this.state.data.val = newValue;
      this.setState(this.state);
      this.props.onTempoChange(this.state.data.val);
    }
  },
  increase: function (e) {
    e.preventDefault();

    var newValue = parseInt.call(null, React.findDOMNode(this.refs.tempo).value) + 1;
    if (newValue <= this.state.data.max) {
      this.state.data.val = newValue;
      this.setState(this.state);
      this.props.onTempoChange(this.state.data.val);
    }
  },
  decrease: function (e) {
    e.preventDefault();

    var newValue = parseInt.call(null, React.findDOMNode(this.refs.tempo).value) - 1;
    if (newValue >= this.state.data.min) {
      this.state.data.val = newValue;
      this.setState(this.state);
      this.props.onTempoChange(this.state.data.val);
    }
  },
  render: function () {
    return (
      <div className='Tempo'>
        <span className='tempo-label'>BPM:</span>
        <span className='minus button' onClick={this.decrease}>&minus;</span>
        <input onBlur={this.handleBlur} onChange={this.handleChange} ref='tempo' type='number' value={this.state.data.val} min={this.state.data.min} max={this.state.data.max}/>
        <span className='plus button' onClick={this.increase}>+</span>
      </div>
    );
  }
});

module.exports = Tempo;
