'use strict';

var SequencerReactApp = require('./SequencerReactApp');
var React = require('react');
// var Router = require('react-router');
// var Route = Router.Route;


// var Routes = (
//   <Route handler={SequencerReactApp}>
//     <Route name="/" handler={SequencerReactApp}/>
//   </Route>
// );

// Router.run(Routes, function (Handler) {
//   React.render(<Handler/>, content);
// });

var content = document.getElementById('content');
React.render(<SequencerReactApp />, content);
