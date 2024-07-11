import React, { Component } from "react";
import * as imgRef from "../configs/images";
import "../styles/landing-page.scss";
import SendSMSStatic from "./SendSMSStatic";
import osType from "../configs/detectOs";
import DownloadButton from "./DownloadButton";
import { DownloadStateConsumer } from "../components/DownloadState";
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
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <React.Fragment>
            <div id="fantasy-winner-outer">
              <div id="fantasy-winner">
                <div>
                  <h1>PLAY FANTASY CRICKET ON vpl!</h1>
                  <div id="sms">
                    <SendSMSStatic />
                  </div>
                </div>
                <div id="winner">
                  <div>
                    <h4>Arun Won</h4>
                    <h2>
                      <span />
                      37
                    </h2>
                    <h3>LAKHS</h3>
                  </div>
                  <div>
                    <img
                      src="/static/fantasywinner/shutterstock_625966880-removebg.png"
                      alt=""
                    />
                  </div>
                </div>
                <div />
              </div>
              <style jsx>{`
                #sms {
                  display: none;
                }
                #fantasy-winner {
                  width: 100%;
                  height: 70vh;
                  color: #fff;
                  background: url("/static/fantasywinner/BG_Mobile.png");
                  display: flex;
                  align-items: center;
                  justify-content: space-evenly;
                  flex-direction: column;
                  h1 {
                    width: 80%;
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
                      font-size: 36px;
                    }
                    img {
                      width: 130px;
                    }
                  }
                }
                @media (min-width: 1200px) {
                  #sms {
                    display: block;
                  }
                  #fantasy-winner-outer {
                    background: url("/static/match/Desktop-BG.png");
                  }
                  #fantasy-winner {
                    max-width: 1200px;
                    background: none;
                    margin: auto;
                    height: 80vh;
                    flex-direction: row;
                    h1 {
                      font-size: 56px;
                      width: 100%;
                      text-align: left;
                      margin-bottom: 100px;
                    }
                    #match img {
                      width: 200px;
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
                <DownloadButton />

                <div>
                  <a href="" />
                </div>
                <div>{getText(config.config)}</div>
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
