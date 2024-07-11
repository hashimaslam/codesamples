import React, { Component } from "react";
import DownloadButton from "./DownloadButton";

const MobileOverlay = ({ close, device, appDownloadClick }) => (
  <div className="overlay">
    <div className="content--area">
      <div>
        <picture>
          <source srcSet="/static/2x/overlay_mobile.webp" type="image/webp" />
          <source srcSet="/static/2x/overlay_mobile.png" type="image/png" />

          <img
            className="banner--img"
            src="/static/2x/overlay_mobile.png"
            alt="overlay not loaded image"
          />
        </picture>
      </div>
      <div className="text--content">
        <h3>Download vpl App to Play Games & Win Cash</h3>

        <div className="info-section">
          <h3 className="info__offer--text">
            Get <span className="old__offer">₹10</span>{" "}
            <span className="new__offer">₹50</span> Bonus Cash
          </h3>
          {/* <div className="info-box">
                                <img className="box--img" src ="/static/overlay/play_and_win.png" alt="Play & Win Cash"/>
                                <p className="text--box">Play & Win Cash</p>
                        
                            
                        </div>
                        <div className="info-box">
                                <img className="box--img" src ="/static/overlay/instant_cash.png" alt="Instant Withdrawls"/>
                                <p className="text--box">Instant Withdrawls</p>
                        </div>
                    </div>
                    <div className="info-section">
                        <div className="info-box">
                                <img className="box--img" src ="/static/overlay/safe_payments.png" alt=" 100% Safe Payments"/>
                                <p className="text--box">100% Safe Payments </p>
                        </div>
                        <div className="info-box">
                                <img className="box--img" src ="/static/overlay/rng_certified.png" alt="RNG Certified"/>
                                <p className="text--box">RNG Certified</p>
                        </div> */}
        </div>
        <div className="button--margin" onClick={() => appDownloadClick(false)}>
          <DownloadButton device={device} showDownload={true} type="overlay" />
        </div>
        <h4
          className="no-thankns color-grey"
          onClick={() => appDownloadClick(true)}
        >
          No Thanks, already have vpl App
        </h4>
      </div>
    </div>
    <div>
      <h4 className="no-thankns" onClick={close}>
        CLOSE
      </h4>
    </div>
    <style jsx>{`
      .content--area {
        background: #ffffff;
        border-radius: 6px;
      }
      .banner--img {
        width: 100%;
        height: 152px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      .text--content {
        padding: 16px;
      }
      h3 {
        font-weight: 500;
        font-size: 18px;
        line-height: 25px;
        color: #000000;
        margin: 0px;
      }

      .box--img {
        height: 16px;
        width: 16px;
      }
      .text--box {
        width: 72px;
        margin: 0px;
        margin-left: 8px;
      }
      .info-section {
        margin: 40px auto;
      }
      .info__offer--text {
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 44px;
        text-align: center;
        color: #777777;
      }

      .old__offer {
        text-decoration: line-through;
      }
      .new__offer {
        color: rgba(10, 153, 29, 1);
        font-size: 20px;
        font-weight: bold;
      }

      .no-thankns {
        ont-weight: 500;
        font-size: 12px;
        line-height: 16px;
        align-items: center;
        text-align: center;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.95);
        margin: 0px;
        margin-top: 24px;
      }
      .color-grey {
        color: #828282;
        margin-top: 16px;
        margin-bottom: 16px;
      }
      .button--margin {
        margin-top: 32px;
        cursor: pointer;
      }
    `}</style>
  </div>
);

const DesktopOverlay = ({
  close,
  userPhoneNo,
  handlePhoneInput,
  error,
  message,
  sendAppLink,
  success,
  appDownloadClick,
}) => (
  <div className="img-block--wrapper">
    <div className="image--block">
      <picture>
        <source srcSet="/static/2x/overlay_desktop.webp" type="image/webp" />
        <source srcSet="/static/2x/overlay_desktop.png" type="image/png" />

        <img
          className="banner--img"
          src="/static/2x/overlay_desktop.png"
          alt="overlay not loaded image"
        />
      </picture>
    </div>
    <div className="content--block">
      <div className="close--sign__align-right">
        <div onClick={close} className="close"></div>
      </div>
      {!success ? (
        <div className="text--content">
          <h3>Download vpl App to Play Games & Win Cash</h3>
          <div className="info-section">
            <h3 className="info__offer--text">
              Get <span className="old__offer">₹10</span>{" "}
              <span className="new__offer">₹50</span> Bonus Cash
            </h3>
            {/* <div className="info-box">
                                    <img className="box--img" src ="/static/overlay/play_and_win.png" alt="Play & Win Cash"/>
                                    <p className="text--box">Play & Win Cash</p>
                            
                                
                            </div>
                            <div className="info-box">
                                    <img className="box--img" src ="/static/overlay/instant_cash.png" alt="Instant Withdrawls"/>
                                    <p className="text--box">Instant Withdrawls</p>
                            </div>
                        </div>
                        <div className="info-section">
                            <div className="info-box">
                                    <img className="box--img" src ="/static/overlay/safe_payments.png" alt=" 100% Safe Payments"/>
                                    <p className="text--box">100% Safe Payments </p>
                            </div>
                            <div className="info-box">
                                    <img className="box--img" src ="/static/overlay/rng_certified.png" alt="RNG Certified"/>
                                    <p className="text--box">RNG Certified</p>
                            </div> */}
          </div>
          <div className="app-link-form">
            <div
              className={`phone-no-input ${error ? "border-color-red" : ""}`}
            >
              <p className="country-code">+91</p>
              <p className="vertical-line"></p>
              <input
                type="text"
                placeholder={"Enter Mobile Number"}
                onChange={handlePhoneInput}
                value={userPhoneNo}
              />
              {error ? (
                <img
                  className="error--icon"
                  src="/static/overlay/overlay_error.png"
                  alt="error icon"
                />
              ) : (
                ""
              )}
            </div>
            {error ? <h4 className="error-text">{message}</h4> : ""}
            <div className="submit--button" onClick={sendAppLink}>
              Get ₹50 Bonus Cash
            </div>
            <h4 className="no-thankns" onClick={() => appDownloadClick(true)}>
              No Thanks, already have vpl App
            </h4>
          </div>
        </div>
      ) : (
        <div className="text--content">
          <img
            className="success--icon"
            src="/static/overlay/overlay_success.png"
            alt="error icon"
          />
          <h3 className="success--message">
            We have sent the vpl App Download link to {userPhoneNo}. Check your
            phone now.
          </h3>
          <div
            className="submit--button"
            onClick={() => appDownloadClick(false)}
          >
            Okay
          </div>
        </div>
      )}
    </div>

    <style jsx>
      {`
        .img-block--wrapper {
          display: flex;
        }
        .image--block {
          width: 296px;
        }
        .banner--img {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }
        .content--block {
          width: 456px;
          height: 100%;
          position: relative;
        }
        .text--content {
          padding: 48px 40px 40px 40px;
        }
        h3 {
          font-weight: 500;
          font-size: 24px;
          line-height: 32px;
          color: #000000;
          margin: 0px;
        }

        .close--sign__align-right {
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        .close {
          position: absolute;
          right: 29px;
          top: 29px;
          width: 14px;
          height: 14px;
          color: #4a4a4a;
          cursor: pointer;
        }

        .close:before,
        .close:after {
          position: absolute;
          content: " ";
          height: 14px;
          width: 2px;
          background-color: #4a4a4a;
        }
        .close:before {
          transform: rotate(45deg);
        }
        .close:after {
          transform: rotate(-45deg);
        }
        .box--img {
          height: 16px;
          width: 16px;
        }
        .text--box {
          width: 72px;
          margin: 0px;
          margin-left: 8px;
        }
        .info-section {
          margin: 70px auto;
        }
        .info__offer--text {
          font-style: normal;
          font-weight: 500;
          font-size: 24px;
          line-height: 44px;
          text-align: center;
          color: #777777;
        }

        .old__offer {
          text-decoration: line-through;
        }
        .new__offer {
          color: rgba(10, 153, 29, 1);
          font-size: 35px;
          font-weight: bold;
        }

        .border-color-red {
          border: 1px solid #f8671d !important;
        }
        .phone-no-input {
          margin-top: 32px;
          display: flex;
          position: relative;
          border: 1px solid #b4b4b4;
          border-radius: 4px;
          height: 52px;
          align-items: center;
          .country-code {
            padding: 12px;
            margin: 0px;
            font-size: 20px;
            line-height: 28px;
            color: #222222;
          }
          .vertical-line {
            border-left: solid 1px #b4b4b4;
            height: 28px;
            margin: 0px;
          }

          .border-color-green {
            border-color: green;
          }
          input[type="text"] {
            outline: none;
            font-weight: normal;
            font-size: 16px;
            font-size: 20px;
            line-height: 28px;
            color: #222222;
            margin: 12px;
            width: 100%;
          }
          input {
            border: 0;
            outline: 0;
          }
          input:focus {
            outline: none !important;
          }
          .error--icon {
            height: 20px;
            width: 20px;
            margin-right: 16px;
          }
        }
        .submit--button {
          font-weight: 500;
          font-size: 18px;
          line-height: 20px;
          color: #ffffff;
          padding: 16px;
          background: #ff1e46;
          border-radius: 4px;
          margin-top: 28px;
          cursor: pointer;
        }
        .no-thankns {
          margin: 0px;
          margin-top: 28px;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 16px;
          text-align: center;
          color: #828282;
          cursor: pointer;
        }
        .error-text {
          font-size: 12px;
          line-height: 16px;
          text-align: left;
          color: #f8671d;
          margin: 0px;
          margin-bottom: -20px;
          margin-top: 4px;
        }
        .success--icon {
          margin-top: 88px;
          width: 128px;
          height: 128px;
        }
        .success--message {
          margin-top: 88px;
          font-size: 20px;
          line-height: 30px;
          text-align: center;
          color: rgba(3, 3, 3, 0.6);
          margin-bottom: 40px;
        }
      `}
    </style>
  </div>
);

class Overlay extends Component {
  constructor(props) {
    super(props);
    this.outsideClick = React.createRef();
    this.startPos = null;
    this.state = {
      showOverlay: false,
      userPhoneNo: "",
      hideForsomeTime: false,
      error: false,
      message: "",
      success: false,
      performixShowWrapper: false,
    };
  }

  componentDidMount() {
    let localStoreDate = localStorage.getItem("timestamp");
    const alreadyDownlaod = localStorage.getItem("alreadyDownlaod");
    const today = new Date().getTime();
    if (localStoreDate) {
      localStoreDate = parseInt(localStoreDate);
    }
    if (
      (!localStoreDate || localStoreDate < today) &&
      !alreadyDownlaod &&
      this.props.device !== "ios"
    ) {
      // if(this.props.device!=="desktop"){
      //     window.addEventListener("touchstart",this.noteTouchStartPos);
      //     window.addEventListener("touchend",this.noteTouchEndPos);
      //     setTimeout(this.showOverlay,10000);
      // }
      const body = document.querySelector("body");
      // body.addEventListener("mouseleave",this.mouseOutEvent);
      body.addEventListener("overlyEvent", this.performixEventListner);
    }
  }
  userActivityListners = () => {
    if (this.props.device !== "desktop") {
      window.addEventListener("touchstart", this.noteTouchStartPos);
      window.addEventListener("touchend", this.noteTouchEndPos);
      setTimeout(this.showOverlay, 10000);
    }
    const body = document.querySelector("body");
    body.addEventListener("mouseleave", this.mouseOutEvent);
  };

  performixEventListner = (e) => {
    if (e.detail.fired() && this.state.performixShowWrapper === false) {
      this.setState({ performixShowWrapper: true });
      this.userActivityListners();
    }
  };

  mouseOutEvent = (e) => {
    this.showOverlay();
  };

  noteTouchStartPos = (e) => {
    this.startPos = e.changedTouches[0].screenY;
  };

  noteTouchEndPos = (e) => {
    const endPos = e.changedTouches[0].screenY;
    if (endPos - this.startPos > 0) {
      setTimeout(this.showOverlay, 1000);
    }
  };

  dontShow1Day = () => {
    const timestamp = new Date(Date.now() + 1000 * 60 * 60 * 24);
    localStorage.setItem("timestamp", "" + timestamp.getTime());
    this.setState({ showOverlay: false, hideForsomeTime: true });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "vpl_Homepage_Close_Optimize",
      ExperimentName: "vpl_Homepage_ExitPopupTest",
      ExperimentID: " K8kaRefYRsyROkC_5agXHg",
      Variant: "Variant1",
      eventAction: "vpl_Homepage_Close_Optimize",
    });
  };

  dontShow6Hrs = () => {
    const timestamp = new Date(Date.now() + 1000 * 60 * 60 * 24);
    localStorage.setItem("timestamp", "" + timestamp.getTime());
    this.setState({ showOverlay: false, hideForsomeTime: true });
  };

  isValidClickToCloseModal = (event) => {
    if (
      this.outsideClick &&
      this.outsideClick.current &&
      !this.outsideClick.current.contains(event.target) &&
      this.state.showOverlay
    )
      this.dontShow6Hrs();
  };

  appDownloadClick = (keyAlreadyDowloaded) => {
    setTimeout(() => {
      this.setState({ showOverlay: false, hideForsomeTime: true });
      localStorage.setItem("alreadyDownlaod", "true");
    }, 1000);
    if (keyAlreadyDowloaded) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "vpl_Homepage_AlreadyDownloaded_Optimize",
        ExperimentName: "vpl_Homepage_ExitPopupTest",
        ExperimentID: " K8kaRefYRsyROkC_5agXHg",
        Variant: "Variant1",
        eventAction: "vpl_Homepage_ AlreadyDownloaded _Optimize",
      });
    }
  };

  showOverlay = () => {
    if (this.state.showOverlay === false && !this.state.hideForsomeTime) {
      this.setState({ showOverlay: true });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "vpl_Homepage_PopupShown_Optimize",
        ExperimentName: "vpl_Homepage_ExitPopupTest",
        ExperimentID: " K8kaRefYRsyROkC_5agXHg",
        Variant: "Variant1",
        eventAction: "vpl_Homepage_PopupShown_Optimize",
      });
    }
  };

  handlePhoneInput = (event) => {
    this.setState({ userPhoneNo: event.target.value, error: false });
  };
  validateMobileNumber = (number) => {
    const phoneno_regex = /^[6-9][0-9]{9}$/;
    return phoneno_regex.test(number);
  };
  sendAppLink = () => {
    if (!this.validateMobileNumber(this.state.userPhoneNo)) {
      this.setState({
        error: true,
        message: "Please enter valid mobile number",
      });
      return;
    }
    let data = {
      To: "+91" + this.state.userPhoneNo,
      VAR1: "DEFAULT",
      pageName: "overlay",
    };
    fetch("/api/applink", {
      body: JSON.stringify(data),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            error: false,
            success: true,
          });
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "vpl_Homepage_PopupClick_Optimize",
            ExperimentName: "vpl_Homepage_ExitPopupTest",
            ExperimentID: " K8kaRefYRsyROkC_5agXHg",
            Variant: "Variant1",
            eventAction: "vpl_Homepage_PopupClick_Optimize",
          });
          localStorage.setItem("alreadyDownlaod", "true");
        }
        if (res.status === 429) {
          throw new Error("somthing went wrong!");
        }
      })
      .catch((err) => {
        this.setState({
          message: "Something went wrong try again later",
          error: true,
        });
        console.log(err);
      });
  };
  render() {
    if (!this.state.showOverlay || !this.state.performixShowWrapper)
      return <div></div>;
    return (
      <>
        <div
          onClick={this.isValidClickToCloseModal}
          className="overlay__outer-area"
        >
          <div className="overlay--center">
            {this.props.device && this.props.device === "desktop" ? (
              <div
                ref={this.outsideClick}
                className="desktop__overlay overlay--background"
              >
                <DesktopOverlay
                  close={this.dontShow1Day}
                  userPhoneNo={this.state.userPhoneNo}
                  handlePhoneInput={this.handlePhoneInput}
                  error={this.state.error}
                  message={this.state.message}
                  sendAppLink={this.sendAppLink}
                  success={this.state.success}
                  appDownloadClick={this.appDownloadClick}
                />
              </div>
            ) : (
              <div ref={this.outsideClick} className="mobile__overlay">
                <MobileOverlay
                  close={this.dontShow1Day}
                  device={this.props.device}
                  appDownloadClick={this.appDownloadClick}
                />
              </div>
            )}
          </div>
        </div>
        <style jsx>{`
          .overlay__outer-area {
            left: 0px;
            top: 0px;
            position: fixed;
            overflow: hidden;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            background: rgba(0, 0, 0, 0.8);
            z-index: 12;
          }
          .overlay--center {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
          }
          .overlay--background {
            background: #ffffff;
            border-radius: 6px;
          }

          .mobile__overlay {
            width: 312px;
            transition: all 0.3s;
          }
          .desktop__overlay {
            width: 752px;
            height: 536px;
            transition: all 0.3s;
          }
        `}</style>
      </>
    );
  }
}

export default Overlay;
