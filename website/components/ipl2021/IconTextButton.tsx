import { DownloadStateConsumer } from "../DownloadState";
import React, { Component } from "react";

class IconTextButton extends Component {
  constructor(props) {
    super(props);
  }

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
    this.performTwoAction(changeState);

    if (this.props.osType === "android" && this.props.isreferral) {
      document.getElementById("android-steps-block").scrollIntoView(true);
    }
  }

  render() {
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config, pageJson }) => (
          <>
            {this.props.iconImageButton &&
            this.props.iconImageButton.showDownload ? (
              <div className="button-container">
                {this.props.osType === "android" ? (
                  <React.Fragment>
                    {!currentState ? (
                      <div
                        className={`${
                          this.props.iconImageButton.cssClasses
                            ? this.props.iconImageButton.cssClasses
                            : ""
                        } `}
                        onClick={() => {
                          this.permformTwoAction_noDownload(changeState);
                        }}
                      >
                        {this.props.iconImageButton.imageUrl && (
                          <img src={this.props.iconImageButton.imageUrl} />
                        )}
                        <span className="btn-text header--medium trim-Bold">
                          {this.props.iconImageButton.text}
                        </span>
                      </div>
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
                          <>
                            <div
                              className={`${
                                this.props.iconImageButton.cssClasses
                                  ? this.props.iconImageButton.cssClasses
                                  : ""
                              } `}
                            >
                              <span className="btn-text header--medium trim-Bold">
                                {
                                  pageJson.body.components[0].data
                                    .androidDownloading
                                }
                              </span>
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ) : (
                  <>
                    {this.props.linkImageIOSButton && (
                      <a
                        onClick={() => {
                          this.permformTwoAction_noDownload(changeState);
                        }}
                        href={this.props.linkImageIOSButton.href}
                        className={`${
                          this.props.linkImageIOSButton.cssClasses
                            ? this.props.linkImageIOSButton.cssClasses
                            : ""
                        } `}
                      >
                        <img
                          src={
                            this.props?.linkImageIOSButton?.imageUrl
                              ? this.props?.linkImageIOSButton?.imageUrl
                              : "/static/2x/ios-download.svg"
                          }
                        />
                      </a>
                    )}
                  </>
                )}
              </div>
            ) : (
              ""
            )}
            <style jsx>{`
              .button-container {
                width: 100%;
                display: flex;
                justify-content: center;
              }

              .download-btn-android {
                position: relative;
                background: #33ff66;
                border: 1px solid #19be00;
                border-radius: 4px;
                padding: 14px 20px;
                text-align: center;
                width: 86%;
                display: flex;
                justify-content: center;
                margin: auto;
                align-items: center;
                &.download-btn-android--banner {
                  position: absolute;
                  bottom: 38px;
                }
                img {
                  margin-right: 12px;
                  height: 24px;
                  width: 24px;
                }
                .btn-text {
                  line-height: 20px;
                }
              }
              .overlay_btn {
                padding: 8px 20px !important;
                width: 100%;
                img {
                  margin-right: 10px;
                  height: 15px;
                  width: 14px;
                }
                .btn-text {
                  font-size: 14px;
                  line-height: 20px;
                }
              }

              .overlay_action-link--banner--ios {
                margin: 0 auto;

                img {
                  max-width: none;
                }
              }
              .action-link--banner--ios {
                width: 144px;
                height: 48px;
                position: absolute;
                bottom: 38px;
                left: 24px;
                transform: translateX(-50%);
                left: 50%;
                img {
                  max-width: none;
                }
              }

              .action-link--footer--ios {
                width: 144px;
                height: 48px;
                display: flex;
                img {
                  max-width: none;
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
                    color: rgb(0, 0, 0);
                  }
                  p {
                    font-size: 10px;
                    line-height: 13px;
                    margin: 0;
                    color: #828282;
                  }
                  span {
                    margin-right: 8px;
                    width: 24px;
                    height: 24px;
                    display: inline-block;
                  }
                }
              }
            `}</style>
          </>
        )}
      </DownloadStateConsumer>
    );
  }
}

export default IconTextButton;
