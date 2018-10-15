import React, { Component } from 'react';
import './App.css';

import queryString from 'query-string';

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
        <input type="text" value={this.props.filterString} onChange={e => this.props.onChangeHandler(e.target.value)}/>
      </div>
    );
  }
}

class PlaylistItem extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, display: 'inline-block', width: '25%' }}>
        <img />
        <h3>{this.props.playlist.name}</h3>
        <ul>
          {this.props.playlist.songs.map((song, i) => <li key={i}>{song.name}</li>)}
        </ul>
      </div>
    );
  }
}

class App extends Component {

  state = {};

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(data => this.setState({
      serverData: {
        user: {
          name: data.display_name,
          playlists: []
        },
      }
    }))
  }

  render() {

    const serverData = this.state.serverData;
    const filteredPlaylists = !serverData ? [] : serverData.user.playlists.filter(playlist => {
      return playlist.name.toLowerCase().includes(this.state.filterString.toLowerCase().trim())
    });

    const totalDurationInSeconds = filteredPlaylists.reduce((totalTime, playlist) => {
      playlist.songs.forEach(song => totalTime += song.duration);
      return totalTime
    }, 0)

    const totalDurationInHours = Math.round(totalDurationInSeconds / 360);

    return (
      <div className="App">
        {
          serverData ? (
            <div>
              <h1 style={defaultStyle}>{serverData.user.name}'s Playlists</h1>
              <Aggregate count={filteredPlaylists.length} type="playlists"></Aggregate>
              <Aggregate count={totalDurationInHours} type="hours"></Aggregate>
              <Filter filterString={this.state.filterString} onChangeHandler={filterString => this.setState({filterString})}/>
              {
                filteredPlaylists.map((playlist, i) => <PlaylistItem playlist={playlist} key={i}/>)
              }
            </div>
          ) : <button onClick={() => window.location='http://localhost:8888/login'} style={{padding: '20px', 'fontSize': '50px', 'marginTop': '20px'}}>Sign in with spotify</button>
        }
      </div>
    );
  }
}

export default App;
