import { DownloadStateConsumer } from "../components/DownloadState";
import React, { Component } from "react";
import "../styles/modal.scss";
import Modal from "react-modal";

export default class extends Component {
  constructor(props) {
    super(props);

    //If on server and if we have this.props.device available
    this.state = {
      showDownload: props.showDownload,
      // btnTxt: "Install the vpl Pro App & Get 20 tokens!",
      // btnLabel: "DOWNLOAD vpl PRO APP",
      // btnImg: this.imgRef.IC_DOWNLOAD,
      osType: props.device,
      emailSendModal: false,
      emailSentModal: false,
    };
  }

  openEmailSendModal = () => {
    this.setState({
      emailSendModal: true,
    });
  };

  closeEmailSendModal = () => {
    this.setState({
      emailSendModal: false,
    });
  };

  openEmailSentModal = () => {
    this.setState({
      emailSentModal: true,
      emailSendModal: false,
    });
  };

  closeEmailSentModal = () => {
    this.setState({
      emailSentModal: false,
    });
  };

  pixelSetup() {
    (function () {
      var colombiaPixelURL =
        "https://ade.clmbtech.com/cde/eventTracking.htm?pixelId=6232&_w=1&rd=" +
        new Date().getTime();
      new Image().src = colombiaPixelURL;
    })();
  }
  performTwoAction(changeState) {
    this.pixelSetup();
    changeState(this.props.buttonPosition);
  }

  permformTwoAction_noDownload(changeState) {
    if (this.props.page && this.props.page.toLowerCase() == "lp/us") {
      this.openEmailSendModal();
    } else {
      this.performTwoAction(changeState);
    }
  }

  render() {
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config, pageJson }) => (
          <>
            {this.props.page && this.props.page.toLowerCase() === "lp/us" && (
              <>
                {/* <Modal
                  isOpen={this.state.emailSendModal}
                  onRequestClose={this.closeEmailSendModal}
                  contentLabel="User Email Modal"
                  ariaHideApp={false}
                  style={{
                    overlay: {
                      background: "rgba(0, 0, 0, 0.5)",
                      zIndex: 10000,
                      position: "fixed",
                      left: "0",
                      top: "0",
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                      animationName: "fadeIn",
                      animationDuration: "0.4s",
                    },
                    content: {
                      borderRadius: "16px 16px 0px 0px",
                      position: "fixed",
                      bottom: "0",
                      width: "100%",
                      animationName: "slideIn",
                      animationDuration: "0.4s",
                      padding: "32px",
                      boxSizing: "border-box",
                      top: "auto",
                      left: "auto",
                      right: "auto",
                      overflow: "visible"
                    },
                  }}
                >
                  <span
                    className="email-send-modal-close"
                    onClick={this.closeEmailSendModal}
                  >
                    <img src="/static/2x/modal-cross.png" />
                  </span>
                
                  <SendEmail
                    openEmailSentModal={this.openEmailSentModal}
                    device={this.props.device}
                    clevertapKey = {config.config.CLAVERTAP_KEY}
                  />
                  <style>
                    {`
                    .email-send-modal-close{
                      position: absolute;
                      right: 18px;
                      top: -60px;
                      background: rgba(255, 255, 255, 0.3);
                      padding: 14px 15px;
                      border-radius: 50%;
                    }
                    `}
                  </style>
                </Modal>

                <Modal
                  isOpen={this.state.emailSentModal}
                  onRequestClose={this.closeEmailSentModal}
                  contentLabel="Sent Email Modal"
                  ariaHideApp={false}
                  style={{
                    overlay: {
                      background: "rgba(0, 0, 0, 0.5)",
                      zIndex: 10000,
                    },
                    modal: {},
                    content: {
                      padding: "32px",
                      top: "54%",
                      left: "50%",
                      right: "auto",
                      bottom: "auto",
                      marginRight: "-50%",
                      transform: "translate(-50%, -50%)",
                      width: "64%",
                    },
                  }}
                >
                  <EmailSent
                    closeEmailSentModal={this.closeEmailSentModal}
                    device={this.props.device}
                  />
                </Modal> */}
              </>
            )}

            <div style={{ width: "100%" }} className={this.props.page}>
              {this.state.showDownload ? (
                // <h1 className="testhasGFJ">{JSON.stringify(pageJson)}</h1>
                <div>
                  {this.state.osType === "android" ? (
                    <React.Fragment>
                      {!currentState ? (
                        <a
                          onClick={() => {
                            this.permformTwoAction_noDownload(changeState);
                          }}
                        >
                          <div
                            className={`android-download-but ${
                              this.props.page &&
                              this.props.page.toLowerCase() === "lp/us"
                                ? "android-but-modal"
                                : ""
                            }`}
                          >
                            {this.props.page &&
                            this.props.page.toLowerCase() === "lp/us" ? (
                              <>
                                {" "}
                                <h2>
                                  {
                                    pageJson.body.components[0].data
                                      .anroudBtnLabelUS
                                  }
                                </h2>
                              </>
                            ) : (
                              <>
                                <img
                                  className="android-icon"
                                  src={
                                    this.props.page === "signup-offer" ||
                                    this.props.page === "poker-affiliate" ||
                                    this.props.page === "redeem-vi-coupon"
                                      ? pageJson.body.components[0].data
                                          .signupOfferAndroidIcon.imageurl.png
                                      : pageJson.body.components[0].data
                                          .androidIcon.imageurl.png
                                  }
                                  alt={
                                    pageJson.body.components[0].data.androidIcon
                                      .altText
                                  }
                                />
                                <h2>
                                  {
                                    pageJson.body.components[0].data
                                      .androidBtnLabel
                                  }
                                </h2>
                                <img
                                  className="download-icon"
                                  src={
                                    pageJson.body.components[0].data
                                      .downArrowIcon.imageurl.png
                                  }
                                  alt={
                                    pageJson.body.components[0].data
                                      .downArrowIcon.altText
                                  }
                                />
                              </>
                            )}
                          </div>
                        </a>
                      ) : (
                        <React.Fragment>
                          {this.props.buttonPosition &&
                          this.props.buttonPosition === "bottom" ? (
                            <div className="android-downloaded">
                              <div className="android-downloaded-image">
                                <picture>
                                  <source
                                    srcSet={
                                      pageJson.body.components[0].data
                                        .notificationBottomIcon.imageurl.webp
                                    }
                                    type="image/webp"
                                  />
                                  <source
                                    srcSet={
                                      pageJson.body.components[0].data
                                        .notificationBottomIcon.imageurl.png
                                    }
                                    type="image/png"
                                  />
                                  <img
                                    src={
                                      pageJson.body.components[0].data
                                        .notificationBottomIcon.imageurl
                                    }
                                    className="downloaded-image-phone"
                                    alt={
                                      pageJson.body.components[0].data
                                        .notificationBottomIcon.altText
                                    }
                                  />
                                </picture>
                              </div>

                              <div className="android-downloaded-message">
                                <strong>
                                  {
                                    pageJson.body.components[0].data
                                      .androidNotificationHeader
                                  }
                                </strong>
                                <div>
                                  <span>
                                    <img
                                      src={
                                        pageJson.body.components[0].data
                                          .notificationDownloadIcon.imageurl.png
                                      }
                                      alt={
                                        pageJson.body.components[0].data
                                          .notificationDownloadIcon.altText
                                      }
                                    ></img>
                                  </span>
                                  <p>
                                    {
                                      pageJson.body.components[0].data
                                        .androidNotificationDesc
                                    }{" "}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="android-download-but">
                              <h2>
                                {
                                  pageJson.body.components[0].data
                                    .androidDownloading
                                }
                              </h2>
                            </div>
                          )}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  ) : (
                    <>
                      {config.config.LANG_CODE === "id" ? (
                        <div className="ios-download-but ios-download-btn-indo">
                          <span>
                            {
                              pageJson.body.components[0].data.iosWhiteIcon
                                .buttonText
                            }
                          </span>
                          <img
                            className="android-icon"
                            src={
                              pageJson.body.components[0].data.androidIcon
                                .imageurl.png
                            }
                          ></img>
                        </div>
                      ) : (
                        <a
                          onClick={() => {
                            this.permformTwoAction_noDownload(changeState);
                          }}
                        >
                          <div className="ios-download-but">
                            <img
                              src={
                                pageJson.body.components[0].data.iosWhiteIcon
                                  .imageurl.png
                              }
                              alt={
                                pageJson.body.components[0].data.iosWhiteIcon
                                  .altText
                              }
                            />
                          </div>
                        </a>
                      )}
                    </>
                  )}
                </div>
              ) : (
                ""
              )}
              <style jsx>{`
                .installbtn {
                }
                #download-but-new {
                  display: none;
                }
                a {
                  text-decoration: none;
                }
                #download-bar {
                  padding: 5px 0;
                  width: 100%;

                  bottom: 80px;
                  font-size: 16px;
                  font-weight: bold;
                  font-style: italic;
                  font-stretch: condensed;
                  line-height: normal;
                  letter-spacing: normal;
                  text-align: center;
                  color: #4a4a4a;
                  background-color: #f8e71c;
                  // z-index: 100;
                  box-shadow: 0 -2px 6px 0 rgba(90, 90, 90, 0.5);

                  #download-but-new {
                    box-shadow: 2px 2px 8px #000;
                    margin-left: 10vw;
                    // margin-top: -10vh;
                    position: absolute;
                    margin-top: -11vh;
                    z-index: 1000;
                    text-transform: none;
                  }
                }
                @keyframes shimmerBackground {
                  0% {
                    background-position: -5000px 0;
                  }
                  100% {
                    background-position: 5000px 0;
                  }
                }
                .android-download-but {
                  background: linear-gradient(
                      121.19deg,
                      rgba(133, 239, 49, 0) 25.73%,
                      rgba(133, 239, 49, 0.6) 45.27%,
                      rgba(133, 239, 49, 0) 62.27%
                    ),
                    #19ce15;
                  animation: shimmerBackground 35s linear infinite;
                  border: 1px solid #20b11d;
                  box-sizing: border-box;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  border-radius: 4px;
                  padding: 0 16px;
                  height: 56px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  h2 {
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 26px;
                    text-align: center;
                    color: #ffffff;
                    align-self: center;
                    margin: 0 16px;
                    text-transform: none;
                  }
                  .android-icon {
                    width: 26px;
                    height: 24px;
                  }
                  .download-icon {
                    width: 19px;
                    height: 24px;
                  }
                  &.android-but-modal {
                    background: #19be00;
                  }
                }
                .ios-download-but {
                  display: flex;
                  height: 56px;
                  background: #000000;
                  border: 2px solid #a6a6a6;
                  box-sizing: border-box;
                  border-radius: 8px;
                  justify-content: center;
                  align-items: center;
                  color: #fff;
                  &.ios-download-btn-indo {
                    img {
                      width: 26px;
                      height: 24px;
                      margin: 0 0 0 14px;
                    }
                  }
                  img {
                    width: 112px;
                    height: 28px;
                  }
                }
                #download-but-new {
                  display: flex;
                  height: 56px;
                  font-family: Roboto;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 16px;
                  line-height: 20px;
                  text-align: center;
                  background: #19be00;
                  color: #fff;
                  align-items: center;
                  justify-content: center;
                  text-transform: none;
                  border: 2px solid #76e521;
                  box-sizing: border-box;
                  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
                  border-radius: 8px;
                  #coin {
                    margin-left: 5px;
                    margin-right: 5px;
                  }
                  img {
                    width: 16.7px;
                    height: 20px;
                    margin: 0 9px;
                    vertical-align: middle;
                  }
                }

                .android-downloaded {
                  display: flex;
                  margin: -16px 0 -16px -24px;
                  .android-downloaded-image {
                    width: 212px;
                    height: 115px;
                  }
                  .downloaded-image-phone {
                    width: 140px;
                    height: 115px;
                    object-fit: cover;
                  }

                  .android-downloaded-message {
                    font-size: 12px;
                    line-height: 16px;
                    text-transform: none;
                    margin: 28px -8px 0 0;
                    text-align: left;
                    div {
                      display: flex;
                      align-items: center;
                      margin: 14px 0 0 0;
                    }
                    strong {
                      font-size: 12px;
                      line-height: 16px;
                      font-weight: 500;
                    }
                    p {
                      font-size: 10px;
                      line-height: 13px;
                      margin: 0;
                    }
                    span {
                      margin-right: 8px;
                      width: 24px;
                      height: 24px;
                      display: inline-block;
                    }
                  }
                }
                .vpl-stories {
                  .android-download-but {
                    background: linear-gradient(
                        121.19deg,
                        rgba(255, 30, 70, 0) 25.73%,
                        rgba(255, 30, 70, 0.6) 45.27%,
                        rgba(255, 30, 70, 0) 62.27%
                      ),
                      #ff1e46;
                    border: solid 1px #ff1e46;
                  }
                }

                .signup-offer {
                  .android-download-but {
                    h2 {
                      font-size: 16px;
                      line-height: 26px;
                    }
                  }
                }
              `}</style>
            </div>
          </>
        )}
      </DownloadStateConsumer>
    );
  }
}
// export default StickyButton;
