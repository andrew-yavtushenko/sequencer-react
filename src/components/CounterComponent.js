'use strict';

var React = require('react/addons');

var CounterComponent = React.createClass({
  getInitialState: function () {
    return {
      data: this.props.data
    };
  },
  handleChange: function (e) {
    e.preventDefault();
    var newValue = parseInt.call(null, React.findDOMNode(this.refs.value).value);
    if (!isNaN(newValue) && typeof newValue === 'number' && this.state.data.min <= newValue <= this.state.data.max) {
      this.state.data.val = newValue;
      this.setState(this.state);
      this.props.onValueChange(this.state.data.val);
    }
  },
  increase: function (e) {
    e.preventDefault();

    var newValue = parseInt.call(null, React.findDOMNode(this.refs.value).value) + 1;
    if (newValue <= this.state.data.max) {
      this.state.data.val = newValue;
      this.setState(this.state);
      this.props.onValueChange(this.state.data.val);
    }
  },
  decrease: function (e) {
    e.preventDefault();

    var newValue = parseInt.call(null, React.findDOMNode(this.refs.value).value) - 1;
    if (newValue >= this.state.data.min) {
      this.state.data.val = newValue;
      this.setState(this.state);
      this.props.onValueChange(this.state.data.val);
    }
  },
  render: function () {
    return (
      <div className={this.state.data.name + ' Counter'}>
        <span className='label'>{this.state.data.label}</span>
        <span className='minus button' onClick={this.decrease}>&minus;</span>
        <input onBlur={this.handleBlur} onChange={this.handleChange} ref='value' type='number' value={this.state.data.val} min={this.state.data.min} max={this.state.data.max}/>
        <span className='plus button' onClick={this.increase}>+</span>
      </div>
    );
  }
});

module.exports = CounterComponent;
