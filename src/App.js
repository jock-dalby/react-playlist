import React, { Component } from 'react';
import './App.css';

const defaultTextColor = '#fff';
let defaultStyle = {
  color: defaultTextColor,
}

class Aggregate extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2>Number Text</h2>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <img />
        <input type="text"/>
      </div>
    );
  }
}

class PlaylistItem extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, display: 'inline-block', width: '25%' }}>
        <img />
        <h3>Playlist name</h3>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 style={defaultStyle}>Title</h1>
        <Aggregate></Aggregate>
        <Aggregate></Aggregate>
        <Filter/>
        <PlaylistItem/>
        <PlaylistItem/>
        <PlaylistItem/>
        <PlaylistItem/>
      </div>
    );
  }
}

export default App;
