import React from 'react';
import axios from 'axios';
import PlayerControls from './components/player-controls/PlayerControl';
import AlbumArt from './components/album-art/AlbumArt';
import PlayerTrack from './components/player-track/PlayerTrack';
import { payload } from './payload';
import $ from 'jquery';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      playStatus: 'play',
      data: [],
      currentTrackIndex: 1,
      tProgress: "",
      tTime: "",
      seekBarWidth: 0
    }
  }
  audio = new Audio();
  componentDidMount() {
    axios({
      method: "post",
      url: "https://app.fakejson.com/q",
      data: payload
    }).then((resp) => {
      this.setState({
        data: Object.values(resp.data)
      });
    });

    // below line in case the axios get
    // does not work - was not working due to free subscription in a day exhaust limit

    // this.setState({
    //   data: Object.values(payload.data)
    // });

    this.audio.addEventListener("timeupdate", () => {
      this.updateCurrTime();
    }, false);
  }
  componentWillUnmount() {
    this.audio.removeEventListener("timeupdate", () => {
      this.updateCurrTime();
    }, false)
  }
  updateCurrTime = () => {
    let curMinutes = Math.floor(this.audio.currentTime / 60);
    let curSeconds = Math.floor(this.audio.currentTime - curMinutes * 60);

    let durMinutes = Math.floor(this.audio.duration / 60);
    let durSeconds = Math.floor(this.audio.duration - durMinutes * 60);

    let playProgress = this.audio.currentTime / this.audio.duration * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;

    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds)) {
      this.setState({
        tProgress: "00:00"
      });
    }
    else {
      this.setState({
        tProgress: curMinutes + ":" + curSeconds
      });
    }

    if (isNaN(durMinutes) || isNaN(durSeconds)) {
      this.setState({
        tTime: "00:00"
      });
    }
    else {
      this.setState({
        tTime: durMinutes + ":" + durSeconds
      });
    }
    if (
      isNaN(curMinutes) ||
      isNaN(curSeconds) ||
      isNaN(durMinutes) ||
      isNaN(durSeconds)
    )
      $("#track-time").removeClass("active");
    else $("#track-time").addClass("active");
    this.setState({
      seekBarWidth: playProgress
    });

    if (playProgress === 100) {
      this.setState({
        seekBarWidth: 0,
        tProgress: "00:00",
        playStatus: 'play'
      });
      $("#album-art").removeClass("buffering").removeClass("active");
    }
  }
  handlePreviousNextClick = (e) => {
    e.preventDefault();
    if (e.currentTarget.id === 'play-previous') {
      if (this.state.currentTrackIndex > 1) {
        this.setState({
          currentTrackIndex: this.state.currentTrackIndex - 1,
          playStatus: 'play'
        }, () => {
          this.togglePlay();
        });
      }
    }
    else {
      if (this.state.currentTrackIndex !== this.state.data.length) {
        this.setState({
          currentTrackIndex: this.state.currentTrackIndex + 1,
          playStatus: 'play'
        }, () => {
          this.togglePlay();
        });
      }
    }
  }
  onMouseMove = (event) => {
    let seekBarPos = $('#s-area').offset();
    let seekT = event.clientX - seekBarPos.left;
    let seekLoc = this.audio.duration * (seekT / $('#s-area').outerWidth());

    $("#s-hover").width(seekT);

    let cM = seekLoc / 60;

    let ctMinutes = Math.floor(cM);
    let ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) $("#ins-time").text("--:--");
    else $("#ins-time").text(ctMinutes + ":" + ctSeconds);

    $("#ins-time").css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }
  onMouseOut = (event) => {
    $("#s-hover").width(0);
    $("#ins-time")
      .text("00:00")
      .css({ left: "0px", "margin-left": "0px" })
      .fadeOut(0);
  }
  onProgressClick = (event) => {
    let seekBarPos = $('#s-area').offset();
    let seekT = event.clientX - seekBarPos.left;
    let seekLoc = this.audio.duration * (seekT / $('#s-area').outerWidth());
    this.audio.currentTime = seekLoc;
    $("#seek-bar").width(seekT);
    $("#s-hover").width(0);
    $("#ins-time")
      .text("00:00")
      .css({ left: "0px", "margin-left": "0px" })
      .fadeOut(0);
  }
  togglePlay = () => {
    this.audio.loop = false;
    let status = this.state.playStatus;
    if (status === 'play') {
      if (this.audio.src !== this.state.data[this.state.currentTrackIndex - 1].trackUrl) {
        this.audio.src = this.state.data[this.state.currentTrackIndex - 1].trackUrl;
      }
      status = 'pause';
      this.audio.play();
    } else {
      status = 'play';
      this.audio.pause();
    }
    this.setState({ playStatus: status });
  }
  render() {
    return (
      <div id="app-cover">
        <div id="bg-artwork"></div>
        <div id="bg-layer"></div>
        <div id="player">
          <PlayerTrack data={this.state.data[this.state.currentTrackIndex - 1]} playing={this.state.playStatus} currTime={this.state.tProgress} trackLength={this.state.tTime} seekBarWidth={this.state.seekBarWidth} onMouseMove={this.onMouseMove} onMouseOut={this.onMouseOut} onProgressClick={this.onProgressClick} />
          <div id="player-content">
            <AlbumArt data={this.state.data} cover={this.state.currentTrackIndex} playing={this.state.playStatus} />
            <PlayerControls playing={this.state.playStatus} onPlayPauseClick={this.togglePlay} onNextPreviousClick={this.handlePreviousNextClick} seekBarWidth={this.state.seekBarWidth} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
