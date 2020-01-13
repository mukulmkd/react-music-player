import React from 'react';

class AlbumArt extends React.Component {
    render() {
        let renderElememts = this.props.data.map((data, key) => {
            return (
                <img src={data.trackImageUrl} key={key} className={key === this.props.cover - 1 ? "active" : ""} alt={data.albumArtworks} id={data.albumArtworks} />
            );
        });
        return (
            <React.Fragment>
                <div id="album-art" className={this.props.playing === 'pause' ? 'active' : ''}>
                    {renderElememts}
                    <div id="buffer-box">Buffering ...</div>
                </div>
            </React.Fragment >
        );
    }
}

export default AlbumArt;