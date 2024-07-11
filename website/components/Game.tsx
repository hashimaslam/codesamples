import React, { Component } from "react";
import "../styles/landing-page.scss";
import SendSMSStatic from "./SendSMSStatic";
import osType from "../configs/detectOs";
import DownloadButton from "./DownloadButton";
import { DownloadStateConsumer } from "../components/DownloadState";
import Head from "next/head";
export default class extends Component {
  constructor(props) {
    super(props);
    // const imgRef = require("../configs/images")();
    //this.state = {imgRef:imgRef};
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
      // <DownloadStateConsumer>
      //   {({ currentState, changeState, config }) => (
      <React.Fragment>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        {this.props.config && this.props.config.config && (
          // To DO - Images r not present - need to uncomment later
          // <div
          //   style={{
          //     backgroundImage: `url(${this.props.config.config.gameAssets.MOBILE_BG})`,
          //   }}
          //   id="game-page"
          // >
          <div
            style={{
              backgroundImage: `url(${this.props.config.config.gameAssets.MOBILE_BG})`,
            }}
            id="game-page"
          >
            <div id="game">
              <div id="heading">
                <h1>DOWNLOAD vpl PRO</h1>
                <p>Play 30+ Mobile Games & Win Money Daily</p>
                <div id="sms">
                  <SendSMSStatic />
                </div>
              </div>
              <div id="game-icon">
                <img
                  src={this.props.config.config.gameAssets.GAME_IMG}
                  alt=""
                />
              </div>
              <div id="user-img">
                <img
                  src={this.props.config.config.gameAssets.USER_IMG}
                  alt=""
                />
              </div>
            </div>

            <style jsx>{`
              #game-page {
                /* background:  */
                background-size: cover;
                background-repeat: no-repeat;
                #sms {
                  display: none;
                }
                width: 100%;
                /* height: 80vh; */
                #game {
                  display: flex;
                  flex-direction: column;
                  #heading {
                    color: #fff;
                    font-style: italic;
                    padding-top: 70px;
                    h1 {
                      font-size: 28px;
                      color: inherit;
                      font-style: inherit;
                    }
                    p {
                      font-size: 20px;
                      color: inherit;
                      font-style: inherit;
                    }
                  }
                }
                #game-icon {
                  img {
                    width: 150px;
                    margin-top: 20px;
                    margin-bottom: -180px;
                    margin-left: -45vw;
                  }
                }
                #user-img {
                  display: flex;
                  justify-content: flex-end;
                  img {
                    height: 300px;
                  }
                }
              }
              @media (min-width: 1200px) {
                #game-page {
                  #sms {
                    display: block;
                  }
                  #game {
                    max-width: 1200px;
                    margin: auto;
                    height: 80vh;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    #heading {
                      height: 300px;
                      padding-top: 0;
                      font-style: italic;

                      h1 {
                        font-size: 80px;
                        text-align: left;
                      }
                      p {
                        font-size: 34px;
                        text-align: left;
                        margin-bottom: 40px;
                      }
                    }
                    #game-icon {
                      width: 40%;
                      img {
                        height: 270px;
                        margin: 0;
                        width: auto;
                      }
                    }
                    #user-img {
                      display: none;
                    }
                  }
                }
              }
            `}</style>
          </div>
        )}
        {this.state && this.props.osType !== "desktop" ? (
          <div id="download-bar">
            <DownloadButton
              device={this.props.osType}
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
