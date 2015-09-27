'use strict';

describe('SequencerReactApp', () => {
  let React = require('react/addons');
  let SequencerReactApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    SequencerReactApp = require('components/SequencerReactApp.js');
    component = React.createElement(SequencerReactApp);
  });

  it('should create a new instance of SequencerReactApp', () => {
    expect(component).toBeDefined();
  });
});
