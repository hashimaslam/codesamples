import React, { Component } from "react";
import * as txt from "../configs/home_data";
import SendSMSStatic from "../components/SendSMSStatic";
import { IC_COIN } from "../configs/images";
import osType from "../configs/detectOs";
import DownloadButton from "./DownloadButton";
import { DownloadStateConsumer } from "../components/DownloadState";

import "../styles/referral-page.scss";
export default class extends Component {
  componentDidMount() {
    this.setState({
      osType: osType(),
    });
  }
  render() {
    const getText = (config) => {
      let text = "";
      if (this.props.referralData) {
        text = `Joining Bonus: Get ₹${this.props.referralData.cashBonus} + ${this.props.referralData.tokenBonus} vpl Tokens Free!`;
      } else {
        if (config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} + ${config.REWARDS.tokenBonus} vpl Tokens Free!`;
        } else if (config.REWARDS.cashBonus && !config.REWARDS.tokenBonus) {
          text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} Free!`;
        } else if (!config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `Joining Bonus: Get ${config.REWARDS.tokenBonus} vpl Tokens Free!`;
        } else {
          text = "";
        }
      }
      return text;
    };
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <div id="landing" className="referral">
            <div className="head" />
            <div className="landing-section">
              <div className="">
                <div className="referral-sec">
                  <div>
                    <h4>{this.props.referralData.displayName}</h4>
                    <p>{txt.REFERRAL_USER_TAGLINE}</p>
                  </div>
                  <div className="card">
                    <p>
                      {this.props.referralData.cashBonus &&
                      !this.props.referralData.tokenBonus
                        ? "GET FREE CASH"
                        : ""}
                      {this.props.referralData.tokenBonus &&
                      !this.props.referralData.cashBonus
                        ? "GET FREE TOKENS"
                        : ""}
                      {this.props.referralData.cashBonus &&
                      this.props.referralData.tokenBonus
                        ? "GET FREE CASH & TOKENS"
                        : ""}
                    </p>
                    <div id="referral-bonus">
                      {this.props.referralData.cashBonus ? (
                        <h2 id="cash">
                          {" "}
                          &#8377;
                          {this.props.referralData.cashBonus}{" "}
                        </h2>
                      ) : (
                        ""
                      )}
                      {this.props.referralData.tokenBonus &&
                      this.props.referralData.cashBonus ? (
                        <h2>+</h2>
                      ) : (
                        ""
                      )}
                      {this.props.referralData.tokenBonus ? (
                        <span style={{ display: "flex" }}>
                          <h2>{this.props.referralData.tokenBonus}</h2>
                          <img id="coin" src={IC_COIN} alt="Tokens" />
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <p className="ref1">{txt.REFERRAL_CARD2}</p>
                    <h4 className="ref1">
                      {this.props.referralData.referralCode}
                    </h4>
                  </div>
                </div>

                {this.state && this.state.osType === "desktop" ? (
                  <SendSMSStatic referralData={this.props.referralData} />
                ) : (
                  ""
                )}
              </div>

              <div className="landing-sec">
                <source
                  srcSet={require(this.props.imageDesktopObj)}
                  type="image/webp"
                />
                <source
                  srcSet={require(this.props.imageDesktopObj)}
                  type="image/jpeg"
                />
                <img
                  src={
                    this.state && this.state.osType === "desktop"
                      ? this.props.imageDesktopObj
                      : this.props.imageDesktopObj
                  }
                  alt="vpl App Screen"
                />
                {/*<img*/}
                {/*src={*/}
                {/*this.state && this.state.osType === "desktop"*/}
                {/*? this.props.imageDesktopObj*/}
                {/*: this.props.imageDesktopObj*/}
                {/*}*/}
                {/*alt="vpl App Screen"*/}
                {/*/>*/}
              </div>
            </div>
            {this.state && this.state.osType !== "desktop" ? (
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
            <style jsx>{``}</style>
          </div>
        )}
      </DownloadStateConsumer>
    );
  }
}

// export default DownloadReferral;
