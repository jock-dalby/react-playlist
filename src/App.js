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
        <img src={this.props.playlist.image} style={{width: '60px'}}/>
        <ul>
          {this.props.playlist.songs.map((song, i) => <li key={i}>{song.name}</li>)}
        </ul>
      </div>
    );
  }
}

// At 35:02 on video

class App extends Component {

  state = {
    filterString: ''
  };

  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name,
      },
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': `Bearer ${accessToken}`}
    })
    .then(response => response.json())
    .then(data => {
      if (!data.items){
        return
      }

      this.setState({
        playlists: data.items
          .filter(item => item.images.length > 0)
          .map(item => ({
            name: item.name,
            songs: [
              {
                name: 'Song a',
                duration: 326
              },
              {
                name: 'Song b',
                duration: 295
              },
              {
                name: 'Song c',
                duration: 188
              },
              {
                name: 'Song d',
                duration: 222
              }
            ],
            image: item.images[0].url
        }))
      })
    })
  }

  render() {

    let filteredPlaylists;
    let totalDurationInHours;
    if(this.state.playlists) {
      filteredPlaylists = this.state.playlists.filter(playlist => {
        return playlist.name.toLowerCase().includes(this.state.filterString.toLowerCase().trim())
      });
  
      const totalDurationInSeconds = filteredPlaylists.reduce((totalTime, playlist) => {
        playlist.songs.forEach(song => totalTime += song.duration);
        return totalTime
      }, 0)
  
      totalDurationInHours = Math.round(totalDurationInSeconds / 360);
    }

    return (
      <div className="App">
        {
          filteredPlaylists ? (
            <div>
              <h1 style={defaultStyle}>{this.state.user.name}'s Playlists</h1>
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
