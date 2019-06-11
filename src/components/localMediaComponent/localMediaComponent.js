import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as guidHelpers from '../../helpers/guidHelpers'
import fmLiveswitch from 'fm.liveswitch'

class LocalMediaComponent extends Component {
    constructor (props) {
        super(props)
  
         this.state = {
             localMedia: null,
             isStarted: false
         }
    }

    componentDidMount() {
        const { captureAudio, captureVideo } = this.props;
        var localMedia = new fmLiveswitch.LocalMedia(captureAudio, captureVideo);
        //var localMedia = new fmLiveswitch.LocalMedia(true, true);

        this.setState({ localMedia: localMedia });
    };
    
    render(){
        //this.start();
        return <div>
            <button
              disabled={this.state.isStarted ? "disabled" : ""}
              onClick={() => this.start()}
              >Start Local Media</button>
            <button
              disabled={this.state.isStarted ? "" : "disabled"}
              onClick={() => this.stop()}
            >Stop Local Media</button>
        </div>
    };    

    componentWillUnmount () {
    };

    start () {
        const { localMedia } = this.state;

        fmLiveswitch.Log.info("Starting LocalMedia...");
        if (localMedia !== null){
            localMedia.start().then((o) => {
                fmLiveswitch.Log.info("LocalMedia started");

                //var layoutManager = new fmLiveswitch.DomLayoutManager(videoContainer);

                this.setState({ isStarted: true });
            })
            .fail((ex) => {
                debugger;
                fmLiveswitch.Log.error("Failed to start localMedia. " + ex);
            });
        }
    };

    stop () {
        const { localMedia } = this.state;

        if (localMedia !== null){
            localMedia.stop().then((o) => {
                fmLiveswitch.Log.info("LocalMedia stopped");

                //var layoutManager = new fmLiveswitch.DomLayoutManager(videoContainer);

                this.setState({ isStarted: false });
            },
            (ex) => {
                fmLiveswitch.Log.error("Failed to stop localMedia. " + ex);
            });    
        };    
    }
};



LocalMediaComponent.propTypes = {
}

LocalMediaComponent.defaultProps = {
    captureAudio: true,
    captureVideo: true
}

export default LocalMediaComponent