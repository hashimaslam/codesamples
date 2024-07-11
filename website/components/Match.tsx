import React, { Component } from "react";
import "../styles/landing-page.scss";
import SendSMSStatic from "./SendSMSStatic";
import osType from "../configs/detectOs";
import DownloadButton from "./DownloadButton";
import { DownloadStateConsumer } from "../components/DownloadState";
import Head from "next/head";
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
    return (
      // <DownloadStateConsumer>
      //   {({ currentState, changeState, config }) => (
      <React.Fragment>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        {this.props.config && this.props.config.config && (
          <React.Fragment>
            <div
              style={{
                backgroundImage: `url(${
                  this.state && this.state.osType !== "desktop"
                    ? this.props.config.config.matchAssets.MOBILE_BG
                    : this.props.config.config.matchAssets.DESKTOP_BG
                })`,
              }}
              id="indiavspak-outer"
            >
              <div id="indiavspak">
                <div>
                  <div>
                    <h1>Play Fantasy Cricket on vpl!</h1>
                    <div id="sms">
                      <SendSMSStatic />
                    </div>
                  </div>
                  <div id="match">
                    <div className="team">
                      <img
                        src={
                          this.state && this.state.osType !== "desktop"
                            ? this.props.config.config.matchAssets.TEAM1_MOBILE
                            : this.props.config.config.matchAssets.TEAM1_DESKTOP
                        }
                        alt=""
                      />
                      <h2>{this.props.config.config.matchAssets.team1}</h2>
                    </div>
                    <div>
                      <h3>VS</h3>
                    </div>
                    <div>
                      <img
                        src={
                          this.state && this.state.osType !== "desktop"
                            ? this.props.config.config.matchAssets.TEAM2_MOBILE
                            : this.props.config.config.matchAssets.TEAM2_DESKTOP
                        }
                        alt=""
                      />
                      <h2>{this.props.config.config.matchAssets.team2}</h2>
                    </div>
                  </div>
                </div>{" "}
                <div />
              </div>
              <style jsx>{`
                #sms {
                  display: none;
                }

                #indiavspak-outer {
                  background-repeat: no-repeat;
                  background-size: cover;
                  background-position: bottom;
                }
                #indiavspak {
                  width: 100%;
                  height: 70vh;
                  color: #fff;
                  /* background: url("/static/match/Mobile-BG.png"); */
                  display: flex;
                  align-items: center;
                  justify-content: space-around;
                  flex-direction: column;
                  background-repeat: no-repeat;
                  background-size: cover;
                  background-position: bottom;

                  h1 {
                    width: 100%;
                    padding-bottom: 30px;
                    margin: auto;
                    font-style: italic;
                  }
                  #match {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    justify-content: space-evenly;
                    h2 {
                      margin: 10px 0;
                      font-style: italic;
                      font-size: 32px;
                    }
                    h3 {
                      margin-top: -45px;
                      font-size: 36px;
                    }
                    img {
                      width: 110px;
                    }
                  }
                }
                @media (min-width: 1200px) {
                  #sms {
                    display: block;
                  }
                  #indiavspak-outer {
                    /* background: url("/static/match/Desktop-BG.png"); */
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-position: bottom;
                  }
                  #indiavspak {
                    max-width: 1200px;
                    background: none;
                    margin: auto;
                    height: 80vh;
                    flex-direction: row;
                    > div {
                      display: flex;
                      align-items: flex-start;
                    }
                    h1 {
                      font-size: 56px;
                      width: 100%;
                      text-align: left;
                      margin-bottom: 100px;
                    }
                    #match {
                      justify-content: center;
                      img {
                        width: 150px;
                        margin: 0 40px;
                      }
                    }
                    > div:first-child {
                      width: 100%;
                    }
                  }
                }
              `}</style>
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
      </React.Fragment>
      //   )}
      // </DownloadStateConsumer>
    );
  }
}
