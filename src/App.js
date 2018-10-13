import React, { Component } from 'react';
import './App.css';

class Aggregate extends Component {
  render() {
    return (
      <div className="aggregate">
        <h2 style={{ color: 'blue' }}>Number Text</h2>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Title</h1>
        <Aggregate></Aggregate>
      </div>
    );
  }
}

export default App;
