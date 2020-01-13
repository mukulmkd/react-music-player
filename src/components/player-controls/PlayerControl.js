import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

export class PlayerControls extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div id="player-controls">
                    <div className="control">
                        <div className="button" id="play-previous" onClick={(e) => this.props.onNextPreviousClick(e)}>
                            <FontAwesomeIcon icon={faBackward} />
                        </div>
                    </div>
                    <div className="control">
                        <div className="button" id="play-pause-button" onClick={this.props.onPlayPauseClick}>
                            {this.props.playing === "play" || this.props.seekBarWidth === 0 ? <FontAwesomeIcon icon={faPlay} /> : <FontAwesomeIcon icon={faPause} />}
                        </div>
                    </div>
                    <div className="control">
                        <div className="button" id="play-next" onClick={(e) => this.props.onNextPreviousClick(e)}>
                            <FontAwesomeIcon icon={faForward} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PlayerControls;