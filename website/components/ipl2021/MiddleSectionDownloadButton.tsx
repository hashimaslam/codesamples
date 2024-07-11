import { DownloadStateConsumer } from "../DownloadState";
import React, { useEffect, Component } from "react";
import { lazyImage } from "../../configs/util";


const DownloadButton = (props) => {
  useEffect(() => {
    lazyImage();
  });
  
  return (
  <div className="btn--android" onClick={() => { props.permformTwoAction_noDownload(props.changeState); }}>
    <div className="icon--text">
      {props.downArrowGreenIcon && props.downArrowGreenIcon.imageurl && <img className="download_icons lazy-image" data-src={props.downArrowGreenIcon.imageurl.png} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII=" alt={props.downArrowGreenIcon.imageurl.alt}  />}
      <h4 className="btn-text  trim-Bold">
        {props.androidMiddleBtnLabel}
      </h4>
    </div>

    <style jsx>{`

    h4{
      margin:0;
    }
    .icon--text{
      display: flex;
      border: 1px solid #8BE899;
      box-sizing: border-box;
      border-radius: 2px;
      align-items: center;
      padding: 8px 24px;
      width: 250px;
      margin: auto;
      justify-content: center;
    }
    .download_icons{
      margin-right:6px;
    }
    .btn-text{
      color: #19BE00;
      font-size: 14px;
      line-height: 20px;
    }

  `}</style>
  </div>
  );
}


const DownloadedButton = (props) => (
  <div className="btn--android">
    <div className="icon--text">
      {props.downArrowGreenIcon && props.downArrowGreenIcon.imageurl && <img className="download_icons" src={props.downArrowGreenIcon.imageurl.png} alt={props.downArrowGreenIcon.imageurl.alt} />}
      <h4 className="btn-text header--medium trim-Bold">
        {props.androidDownloading}
      </h4>
    </div>

    <style jsx>{`

      h4{
        margin:0;
      }
      .icon--text{
        display: flex;
        border: 1px solid #8BE899;
        box-sizing: border-box;
        border-radius: 2px;
        align-items: center;
        padding: 8px 24px;
        width: 250px;
        margin: auto;
        justify-content: center;
      }
      .download_icons{
        margin-right:6px;
      }
      .btn-text{
        color: #19BE00;
        font-size: 14px;
        line-height: 20px;
      }

  `}</style>
  </div>
)

const IosButton = (props) => (
  <>

    {props.iosBlackIcon && props.iosBlackIcon.imageurl && (<a onClick={() => { props.permformTwoAction_noDownload(props.changeState); }}
      href={props.iosBlackIcon.href}
    >
      <div className="btn--ios">
        <img className="img" src={props.iosBlackIcon.imageurl.png} />
      </div>
      <style jsx>{`
    
      .btn--ios{
        height: 44px;
        background: #fff;
        border: 1px solid #000000;
        box-sizing: border-box;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
        margin: auto;
      }
      .img{
        height: 28px;
      }
    
    `}</style>
    </a>)}

  </>
)
class MiddleDownloadBut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDownload: props.showDownload,
    };
  }

  pixelSetup() {
    (function () {
      var colombiaPixelURL =
        "https://ade.clmbtech.com/cde/eventTracking.htm?pixelId=6232&_w=1&rd=" +
        new Date().getTime();
      new Image().src = colombiaPixelURL;
    })();
  }
  performTwoAction = (changeState) => {
    this.pixelSetup();
    changeState(this.props.buttonPosition);
  }

  permformTwoAction_noDownload = (changeState) => {
    this.performTwoAction(changeState);
  }

  render() {
    if (this.state.osType === "desktop")
      return (
        <section>
          <div className={"container " + this.props.cssClassList}>
          </div>
        </section>

      )
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config, pageJson }) => (
          <section>
            <div className="container">
              <div className={this.props.cssClassList}>
                {this.props.osType === "android" && !currentState && (<DownloadButton {...this.props} changeState={changeState} permformTwoAction_noDownload={this.permformTwoAction_noDownload} />)}
                {this.props.osType === "android" && currentState && (<DownloadedButton {...this.props} changeState={changeState} permformTwoAction_noDownload={this.permformTwoAction_noDownload} />)}
                {this.props.osType === "ios" && !currentState && (<IosButton {...this.props} changeState={changeState} permformTwoAction_noDownload={this.permformTwoAction_noDownload} />)}
              </div>
            </div>
          </section>
        )}
      </DownloadStateConsumer>
    );
  }
}

export default MiddleDownloadBut;