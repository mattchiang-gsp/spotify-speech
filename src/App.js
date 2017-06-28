import React, { Component } from 'react';
import logo from './logo.svg';
import Spotify from 'spotify-web-api-js';
import {requestAuthorization, implicitGrant} from './utils.js';
import annyang from 'annyang';
import './App.css';

var audio = new Audio();
var s = new Spotify();


class App extends Component {

  constructor(props) {
    super(props);
    // var Spotify = require('spotify-web-api-js');  
    if (annyang) {
      // Let's define our commands. First the text we expect, and then the function it should call
      var commands = {
        'stop': function() {
          audio.pause();
          console.log("stopping");
        },
        'play *song': function(song) {
          console.log(song);
          

          s.searchTracks(song)
            .then(function(data) {
              // var audio = new Audio();
              console.log(data.tracks.items[0]);
              var track = data.tracks.items[0];
              audio.src = track.preview_url;
              audio.play();
              console.log("playing");
            }, function(err) {
              console.error(err);
            });
        },

        ':nomatch': function(message) {
          console.log("Command spoken has no match");
        }
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      // Start listening on construction
      annyang.start();
    }

    annyang.addCallback('error', function() { console.log("annyang startup error"); });
  }

  handleClick() {
    requestAuthorization();
  }

  setToken() {
    var token = implicitGrant();
    s.setAccessToken(token);
  }

  // Music
  playSong(songName) {
    var query = songName;

    s.searchTracks("heart don't stand a chance")
      .then(function(data) {
        // var audio = new Audio();
        console.log(data.tracks.items[0]);
        var track = data.tracks.items[0];
        audio.src = track.preview_url;
        audio.play();
        console.log("playing");
      }, function(err) {
        console.error(err);
      });
  }



  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.handleClick} type="button">
          requestAuthorization
        </button>
        <button onClick={this.setToken} type="button">
          implicitGrant
        </button>        

      </div>
    );
  }
}

export default App;
