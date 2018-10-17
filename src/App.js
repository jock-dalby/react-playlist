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
          {this.props.playlist.tracks.map((track, i) => <li key={i}>{track.name}</li>)}
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
    .then(playlistData => {
      const playlists = playlistData.items
      const trackDataPromises = playlists.map(playlist => {
        const responsePromise = fetch(playlist.tracks.href, {
          headers: { 'Authorization': `Bearer ${accessToken}`}
        })
        const trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })

      const allTrackDataPromises = Promise.all(trackDataPromises);

      const playlistPromise = allTrackDataPromises
        .then(trackDatas => {
          playlists.forEach((playlist, i) => {
            playlist.trackDatas = trackDatas[i].items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
          console.log(playlists)
          return playlists
        })
      return playlistPromise
    })
    .then(playlists => {
      if (!playlists){
        return
      }

      this.setState({
        playlists: playlists
          .filter(item => item.images.length > 0)
          .map(item => ({
            name: item.name,
            tracks: item.trackDatas.slice(0, 3),
            image: item.images[0].url
        }))
      })
    })
  }

  filterStringMatch(str) {
    return str.toLowerCase().includes(this.state.filterString.toLowerCase().trim())
  }

  render() {

    let filteredPlaylists;
    let totalDurationInHours;
    if(this.state.playlists) {
      filteredPlaylists = this.state.playlists.filter(playlist => {
        const filterStringInPlaylistName = this.filterStringMatch(playlist.name);
        const filterStringInATrackName = playlist.tracks.some(track => this.filterStringMatch(track.name));
        return filterStringInPlaylistName || filterStringInATrackName;
      });
  
      const totalDurationInSeconds = filteredPlaylists.reduce((totalTime, playlist) => {
        playlist.tracks.forEach(track => totalTime += track.duration);
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
          ) : <button onClick={() => {
            window.location = window.location.href.includes('localhost') ? 'http://localhost:8888/login' : 'https://react-playlist-backend-456.herokuapp.com/login'
          }} style={{padding: '20px', 'fontSize': '50px', 'marginTop': '20px'}}>Sign in with spotify</button>
        }
      </div>
    );
  }
}

export default App;
