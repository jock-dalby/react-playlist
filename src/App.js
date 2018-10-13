import React, { Component } from 'react';
import './App.css';

const defaultTextColor = '#fff';
let defaultStyle = {
  color: defaultTextColor,
}

let fakeServerData = {
  user: {
    name: 'Pete'
  }
};

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

  state = {};

  componentDidMount() {
    this.setState({
      serverData: fakeServerData
    })
  }

  render() {
    return (
      <div className="App">
        {
          this.state.serverData ? <h1 style={defaultStyle}>{this.state.serverData.user.name}'s Playlists</h1> : null
        }
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
