import React, { Component } from "react";
import "../styles/landing-page.scss";
import SendSMSStatic from "./SendSMSStatic";
import osType from "../configs/detectOs";
import DownloadButton from "./DownloadButton";
import { DownloadStateConsumer } from "./DownloadState";
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = { osType: props.osType };
  }
  componentDidMount() {
    // this.setState({
    //   osType: osType()
    // });
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
    return (
      // <DownloadStateConsumer>
      //   {({ currentState, changeState, config }) => (
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
                <picture>
                  <source srcSet={this.props.imageObj} type="image/webp" />
                  <source srcSet={this.props.imageObj} type="image/jpeg" />
                  <img src={this.props.imageObj} />
                </picture>
              )}
            </div>
          </div>
        </div>
        {this.props.osType !== "desktop" ? (
          <div id="download-bar">
            <DownloadButton
              device={this.state.osType}
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
      //   )}
      // </DownloadStateConsumer>
    );
  }
}
