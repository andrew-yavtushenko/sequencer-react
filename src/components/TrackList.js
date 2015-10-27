'use strict';

var React = require('react/addons');
var Router = require('react-router').Router
var Route = require('react-router').Route
var Link = require('react-router').Link

module.exports = React.createClass({
  render: function () {
    return (
      <ul>{
        this.state.data.items.map(function (item, key) {
          return (
            <li key={key}>
              <Link to={'item/${item.id}'}>{item.title}</Link>
            </li>
          );
        })
      }</ul>
    );
  }
});
