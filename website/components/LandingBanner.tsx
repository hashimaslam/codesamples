import React, { Component } from "react";
import * as imgRef from "../configs/images";
import "../styles/landing-page.scss";
import SendSMSStatic from "./SendSMSStatic";
import osType from "../configs/detectOs";
import DownloadButton from "./DownloadButton";
import { DownloadStateConsumer } from "./DownloadState";
export default class extends Component {
  componentDidMount() {
    this.setState({
      osType: osType(),
    });
  }
  render() {
    const getText = (config) => {
      let text = "";
      if (config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} + ${config.REWARDS.tokenBonus} vpl Tokens Free!`;
      } else if (config.REWARDS.cashBonus && !config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} Free!`;
      } else if (!config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ${config.REWARDS.tokenBonus} vpl Tokens Free!`;
      } else {
        text = "";
      }
      return text;
    };

    // const divStyle = {
    //     backgroundImage: 'url(' + this.props.imageDObj + ')',
    //     width: '300px'
    // };
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <React.Fragment>
            <div
              id={this.props.parentId}
              style={
                this.state && this.state.osType === "desktop"
                  ? {}
                  : { backgroundImage: `url(${this.props.imageObj})` }
              }
            >
              <div
                className={
                  this.state && this.state.osType === "desktop"
                    ? "head"
                    : this.props.headClass
                }
              >
                <div className="mobile">
                  <h2>{this.props.heading1}</h2>
                  <h2>{this.props.heading2}</h2>
                  <p>{this.props.paragraph}</p>
                </div>
              </div>
              <div className={this.props.sectionClass}>
                {this.state && this.state.osType === "desktop" ? (
                  <div id="heading-txt" className="desktop">
                    <h2>{this.props.heading1}</h2>
                    <h2>{this.props.heading2}</h2>
                    <p>{this.props.paragraph}</p>
                    <SendSMSStatic />
                  </div>
                ) : (
                  ""
                )}
                <div className={this.props.secondaryClass}>
                  {this.state && this.state.osType === "desktop" ? (
                    <picture>
                      <source
                        srcSet={this.props.imageDesktopObj}
                        type="image/webp"
                      />
                      <source
                        srcSet={this.props.imageDesktopObj}
                        type="image/jpeg"
                      />
                      <img src={this.props.imageDesktopObj} />
                    </picture>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* <img id="crest-back" src={imgRef.vpl_CREST_WHITE} alt="" /> */}
            </div>
            {this.props.showDownloadButton &&
            this.state &&
            this.state.osType !== "desktop" ? (
              <div id="download-bar">
                <DownloadButton />

                <div>
                  <a href="" />
                </div>
                <div>{getText(config.config)}</div>
              </div>
            ) : (
              ""
            )}

            <style jsx>{`
              @media (max-width: 768px) {
                #landing {
                  background-position-x: center;
                  min-height: 75vh;
                  display: block;

                  .head {
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    padding-top: 70px;
                    margin-bottom: 15px;
                    background: linear-gradient(
                      180deg,
                      rgba(0, 0, 0, 0.6) 62.04%,
                      rgba(0, 0, 0, 0) 100%
                    );
                    h2 {
                      text-align: left;
                      text-transform: capitalize;
                      margin: 0 2px;
                      color: #fff;
                      font-size: 20px;
                      font-weight: bold;
                      font-stretch: condensed;
                      line-height: normal;
                      letter-spacing: normal;
                      display: inline;
                    }
                    p {
                      font-size: 14px;
                      color: #fff;
                    }
                  }

                  .head-home {
                    display: flex;
                    justify-content: center;
                    align-content: center;
                    padding-top: 70px;
                    margin-bottom: 15px;
                    background: linear-gradient(
                      180deg,
                      #ffffff 77.19%,
                      rgba(255, 255, 255, 0) 100%
                    );
                    h2 {
                      text-align: left;
                      text-transform: capitalize;
                      margin: 0 2px;
                      color: #222222;
                      font-size: 24px;
                      font-style: normal;
                      font-weight: bold;
                      line-height: 30px;
                      font-stretch: condensed;
                      line-height: normal;
                      letter-spacing: normal;
                      display: inline;
                    }
                    p {
                      font-size: 14px;
                      color: #4a4a4a;
                    }
                  }

                  .landing-sec img {
                    z-index: -1;

                    position: relative;
                    left: 0;
                    bottom: -2px;
                  }
                }
              }
            `}</style>
          </React.Fragment>
        )}
      </DownloadStateConsumer>
    );
  }
}
