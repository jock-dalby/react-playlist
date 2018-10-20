import React, { Component } from 'react';
import 'reset-css/reset.css';
import './App.css';

import queryString from 'query-string';

let defaultStyle = {
  color: '#fff',
  fontFamily: 'Papyrus'
}

class Aggregate extends Component {
  render() {
    const countIsZero = this.props.count === 0;
    const aggStyle = {
      ...defaultStyle,
      width: '40%',
      display: 'inline-block',
      'margin-bottom': '10px',
      'line-height': '30px',
      color:  countIsZero ? 'red' : defaultStyle.color,
      'font-weight': countIsZero ? 'bold' : 'normal',
      'font-size': '14px',
    }
    return (
      <div style={aggStyle}>
        <h2>{this.props.count} {this.props.type}</h2>
      </div>
    )
  }
}

class Filter extends Component {
  render() {
    return (
      <div>
        <p style={defaultStyle}>Search by playlist or track name:</p>
        <input type="text"
          value={this.props.filterString}
          style={{'font-family': defaultStyle.fontFamily, 'font-size': '20px', padding: '10px', 'margin-bottom': '20px'}}
          onChange={e => this.props.onChangeHandler(e.target.value)}/>
      </div>
    );
  }
}

class PlaylistItem extends Component {
  render() {
    return (
      <div style={{
        // ...defaultStyle,
        display: 'inline-block',
        border: '1px solid white',
        width: '30%',
        height: '200px',
        'vertical-align': 'top',
        'padding': '10px',
        background: this.props.index % 2 ? '#C0C0C0' : 'gray'
        }}>
        <p style={{'font-size': '26px'}}>{this.props.playlist.name}</p>
        <img src={this.props.playlist.image} style={{width: '60px'}}/>
        <ul style={{'margin-top': '10px', 'font-weight': 'bold'}}>
          {this.props.playlist.tracks.map((track, i) => <li key={i} style={{'margin-top': '2px', 'font-size': '20px'}}>
            {track.name}
          </li>)}
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
      if(!playlists) {
        return
      }
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
              <h1 style={{...defaultStyle, 'font-size': '54px', 'margin-top': '5px'}}>
                {this.state.user.name}'s Playlists
              </h1>
              <Aggregate count={filteredPlaylists.length} type="playlists"></Aggregate>
              <Aggregate count={totalDurationInHours} type="hours"></Aggregate>
              <Filter filterString={this.state.filterString} onChangeHandler={filterString => this.setState({filterString})}/>
              {
                filteredPlaylists.map((playlist, i) => <PlaylistItem playlist={playlist} index={i} key={i}/>)
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
