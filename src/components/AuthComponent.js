'use strict';

var React = require('react/addons');
var connector = require('./Connector');

function checkAuth (successCallback, unauthenticatedCallback) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'text';

  xhr.addEventListener('load', function (e) {
    if (e.target.status === 404) {
      unauthenticatedCallback(JSON.parse(e.target.response));
    } else {
      successCallback(JSON.parse(e.target.response));
    }
  }, false);

  xhr.open('GET', '/users/current');
  xhr.send(null);
}

module.exports = React.createClass({
  getInitialState: function () {
    return {
      checked: false,
      authenticated: false,
      items: [],
      authOptions: {
        login: []
      }
    };
  },
  componentDidMount: function () {
    checkAuth(this.authenticated, this.unauthenticated);
  },
  authenticated: function (resp) {
    this.state.checked = true;
    this.state.authenticated = true;
    this.state.userData = resp.user;
    this.getItems();
    this.setState(this.state);
  },
  unauthenticated: function (resp) {
    this.state.checked = true;
    this.state.authenticated = false;
    this.state.authOptions = resp;
    this.setState(this.state);
  },
  connect: function (service, e) {
    e.preventDefault();
    e.stopPropagation();
    connector(service.url, service.name.toLowerCase()).then(function () {
      checkAuth(this.authenticated, this.unauthenticated);
    }.bind(this));
  },
  renderAuthOptions: function () {
    return (
      <ul className="authOptions">{
        this.state.authOptions.login.map(function (authOption, key) {
          return (
            <li key={key}>
              <a href="#" onClick={this.connect.bind(this, authOption)}>{authOption.name}</a>
            </li>
          );
        }.bind(this))
      }</ul>
    );
  },
  getItems: function () {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'text';
    xhr.addEventListener('load', function (event) {
      this.state.items = JSON.parse(event.target.response).items;
    }.bind(this), false);

    xhr.open('GET', '/items');
    xhr.send(null);
  },
  renderUserData: function () {
    return (
      <ul className="user-data">
        <li>
          <a href="#">Library</a>
        </li>
        <li className="user">
          <img src={this.state.userData.image_url} alt={this.state.userData.name}/>
          {this.state.userData.name}
        </li>
        <li className="logout">
          <a href="#" onClick={this.logout}>logout</a>
        </li>
      </ul>
    );
  },
  logout: function (event) {
    event.preventDefault();
    event.stopPropagation();
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'text';

    xhr.addEventListener('load', function () {
      this.state.authenticated = false;
      this.setState(this.state);
      checkAuth(this.authenticated, this.unauthenticated);
    }.bind(this), false);

    xhr.open('GET', '/logout');
    xhr.send(null);
  },
  renderAuthState: function () {
    return this.state.authenticated
      ? this.renderUserData()
      : this.renderAuthOptions();
  },
  render: function () {
    return (
      <div className="auth nav nav-right">{
        this.state.checked
          ? this.renderAuthState()
          : void 0
      }</div>
    );
  }
});
