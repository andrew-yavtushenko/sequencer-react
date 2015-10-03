'use strict';

var React = require('react/addons');

var NameInput = React.createClass({
  getInitialState: function () {
    return {
      data: {
        val: this.props.val,
        showInput: false
      }
    };
  },
  handleNameChange: function (e) {
    e.preventDefault();
    var newName = this.refs.name.getDOMNode().value.trim();
    if ((/^[a-zA-Z0-9\s]+$/gi).test(newName)) {
      this.props.onNameChange(newName);
      //this.state.data.val = newName;
      this.state.showInput = false;
      this.setState(this.state);
    }
  },
  handleNameClick: function (e) {
    e.preventDefault();
    this.state.showInput = true;
    this.setState(this.state);
    setTimeout(function () {
      this.refs.name.getDOMNode().value = this.props.val;
      this.refs.name.getDOMNode().focus();
    }.bind(this), 0);
  },
  render: function () {
    return (
      <div className="NameInput">
        {this.state.showInput ?
          <form className='inputName' onSubmit={this.handleNameChange}>
            <input type="text" onBlur={this.handleNameChange} ref='name'/>
          </form> :
          <span className='title' onClick={this.handleNameClick.bind(this)}>{this.props.val}</span>
        }
      </div>
    );
  }
});

module.exports = NameInput;
