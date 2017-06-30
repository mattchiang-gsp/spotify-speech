import React, { Component } from 'react'
import AuthMenu from './components/AuthMenu'
import Video from './components/Video'
import logo from './logo.svg'
import Spotify from 'spotify-web-api-js'
import YouTube from 'youtube-node'
import YouTubePlayer from 'youtube-player'
import {requestAuthorization, implicitGrant} from './spotifyUtils.js'
import annyang from 'annyang'
import './App.css'

const AUDIO = new Audio()
const SPOTIFY = new Spotify()
const YOUTUBE = new YouTube()
YOUTUBE.setKey('AIzaSyA_5__FkmspfXLvOqajSVohXaBm_PZnXvE')


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };

  }

  componentDidMount() {
    const player = YouTubePlayer('player');
    let App = this;
    let ytVidId;

    if (annyang) {
      console.log("annyang speech recognition is successfully on")
      
      const commands = {
        
        'stop': () => {
          AUDIO.pause()
          console.log("Stopping the music")
        }, 

        'play *song': (song) => {
          console.log("User wants to play: " + song);        

          SPOTIFY.searchTracks(song)
            .then(function(data) {
              var track = data.tracks.items[0]
              AUDIO.src = track.preview_url
              AUDIO.play()
              console.log("Playing: " + song)
            })
            .catch( 
              (err) => { 
                console.log('Handle rejected promise (' + err + ') here. ')
            })
        },

        "I'm feeling *emotion": (emotion) => {
          console.log("I'm feeling " + emotion)

          let playlistID, playlistName, playlistOwner
          
          // Get playlist
          SPOTIFY.getCategoryPlaylists("mood")
            .then(function(data) {
              let firstResult = data.playlists.items[0]
              playlistID = firstResult.id
              playlistOwner = firstResult.owner.id
              playlistName = firstResult.name
            })
            .then(function(data) {
              console.log("Grabbed " + playlistName + " by " + playlistOwner)
              SPOTIFY.getPlaylistTracks(playlistOwner, playlistID)
                .then(function(data) {
                  // Randomly pick a track from the playlist
                  let r = Math.floor((Math.random() * data.items.length) + 1)
                  let track = data.items[r].track
                  console.log("Playing " + track.name + " by " + track.artists[0].name)
                  YOUTUBE.search(track.name + track.artists[0].name, 2, function(error, result) {
                    if (error) {
                      console.error(error)
                    }
                    else {
                      ytVidId = result.items[0].id.videoId
                      
                      App.setState({
                        id: ytVidId
                      })
                      console.log(App.state)

                      // player.stopVideo()
                      player.loadVideoById(App.state.id)
                      player.playVideo()
                    }
                  })
              })
                .catch(
                  (err) => {
                    console.log('Handle rejected promise (' + err + ') here grabbing YT video. ')
                  })
            })
        },

        ':nomatch': function(message) {
          console.log("Command spoken has no match")
        }
      }

      // Add our commands to annyang
      annyang.addCommands(commands)

      // Start listening on construction
      annyang.start()
    }

    annyang.addCallback('error', function() { console.log("annyang startup error") })
  }

  _onAuthClick = () => {
    requestAuthorization()
  }

    // Set the access token
  _onGrantClick = () => {
    let token = implicitGrant()
    SPOTIFY.setAccessToken(token)
  }

  // Test for changing YT video URL
  // changeVidId() {
  //   const player = YouTubePlayer('player'); // why is this here?
  //   console.log(this.state.id);
  //   let newId = this.state.id;
  //   console.log("newId: " + newId);
  //   player.pauseVideo();
  //   player.loadVideoById(newId);
  //   // player.stopVideo();
  //   if (newId) {
  //     // player.loadVideoById(newId);
  //     // player.loadVideoById("j-K0MeOMt1k");
  //   } else {
  //     console.log("else")
  //     // player.loadVideoById("j-K0MeOMt1k");
  //   }
  // }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Play songs from Spotify with Speech Recognition</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <AuthMenu
          onHandleAuthClick={this._onAuthClick}
          onHandleGrantClick={this._onGrantClick}
        />

        <Video></Video>       

      </div>
    );
  }
}

export default App;