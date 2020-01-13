import React from 'react';

class PlayerTrack extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            currTime: "",
            tTime: "",
            seekBarWidth: 0
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            data: nextProps.data,
            currTime: nextProps.currTime,
            tTime: nextProps.trackLength,
            seekBarWidth: nextProps.seekBarWidth
        });
    }
    render() {
        return (
            <React.Fragment>
                <div id="player-track" className={this.props.playing === 'pause' || (this.props.currTime === "00:00") ? 'active' : ''}>
                    <div id="album-name">{this.state.data.albumName}</div>
                    <div id="track-name">{this.state.data.trackName}</div>
                    <div id="track-time" className="active">
                        <div id="current-time">{this.state.currTime}</div>
                        <div id="track-length">{this.state.tTime}</div>
                    </div>
                    <div id="s-area" onMouseMove={(e) => this.props.onMouseMove(e)} onMouseOut={(e) => this.props.onMouseOut(e)} onClick={(e) => this.props.onProgressClick(e)}>
                        <div id="ins-time"></div>
                        <div id="s-hover" style={{ width: '0px' }}></div>
                        <div id="seek-bar" style={{ width: this.state.seekBarWidth + "%" }}></div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PlayerTrack;