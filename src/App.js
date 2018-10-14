import React, { Component } from 'react';
import './App.css';

import fakeServerData from './fakeServerData';

const defaultTextColor = '#fff';
let defaultStyle = {
  color: defaultTextColor,
}

class Aggregate extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: '40%', display: 'inline-block' }}>
        <h2>{this.props.count} {this.props.type}</h2>
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
        <h3>{this.props.playlist.playlistName}</h3>
        <ul>
          {this.props.playlist.songs.map(song => <li>{song.name}</li>)}
        </ul>
      </div>
    );
  }
}

class App extends Component {

  state = {};

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        serverData: fakeServerData
      })
    }, 1000)
  }

  render() {

    const totalDurationInSeconds = this.state.serverData && this.state.serverData.user.playlists.reduce((totalTime, playlist) => {
      playlist.songs.forEach(song => totalTime += song.duration);
      return totalTime
    }, 0)

    const totalDurationInHours = Math.round(totalDurationInSeconds / 360);
    const serverData = this.state.serverData;

    return (
      <div className="App">
        {
          serverData ? (
            <div>
              <h1 style={defaultStyle}>{serverData.user.name}'s Playlists</h1>
              <Aggregate count={serverData.user.playlists.length} type="playlists"></Aggregate>
              <Aggregate count={totalDurationInHours} type="hours"></Aggregate>
              <Filter/>
              {serverData.user.playlists.map(playlist => <PlaylistItem playlist={playlist}/>)}
            </div>
          ) : <h1 style={defaultStyle}>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;
