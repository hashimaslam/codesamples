import React, { Component } from "react";
import * as imgRef from "../configs/images";
import "../styles/landing-page.scss";
import SendSMSStatic from "./SendSMSStatic";
import osType from "../configs/detectOs";
import DownloadButton from "./DownloadButton";
import { DownloadStateConsumer } from "../components/DownloadState";
import browser from "../configs/detectBrowser";

export default class extends Component {
  static async getInitialProps(data) {}

  constructor(props) {
    super(props);
    let deviceType = props.device;
    let browserName = props.browser;
    if (typeof window !== "undefined") {
      deviceType = osType();
      browserName = browser();
    }

    // const imgRef = require("../configs/images")(browserName);
    this.state = {
      osType: deviceType,
      browser: browserName,
    };
  }
  // componentDidMount() {
  //   this.setState({
  //     osType: osType()
  //   });
  // }
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
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <React.Fragment>
            <div id={this.props.parentId}>
              <div className="head">
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
                  <img
                    src={
                      this.state && this.state.osType === "desktop"
                        ? this.props.imageDesktopObj
                        : this.props.imageObj
                    }
                    alt="vpl App Screen"
                  />
                </div>
              </div>
              {/* <img id="crest-back" src={imgRef.vpl_CREST_WHITE} alt="" /> */}
            </div>
            {this.state && this.state.osType !== "desktop" ? (
              <div id="download-bar">
                <DownloadButton
                  device={this.props.device}
                  config={this.props.config}
                />

                <div>
                  <a href="" />
                </div>
                <div>{getText(this.props.config.config)}</div>
              </div>
            ) : (
              ""
            )}
          </React.Fragment>
        )}
      </DownloadStateConsumer>
    );
  }
}
