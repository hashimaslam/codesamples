import React, { Component } from "react";
import * as imgRef from "../configs/images";
import "../styles/group.scss";
import SendSMs from "./SendSMS";
import osType from "../configs/detectOs";
import DownloadButton from "./DownloadButton";
import { DownloadStateConsumer } from "./DownloadState";
export default class extends Component {
  componentDidMount() {
    this.setState({
      osType: osType()
    });
  }
  render() {
    const getText = config => {
      let text = "";
      if (config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} + ${config.REWARDS.tokenBonus
          } vpl Tokens Free!`;
      } else if (config.REWARDS.cashBonus && !config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ₹${config.REWARDS.cashBonus} Free!`;
      } else if (!config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
        text = `Joining Bonus: Get ${config.REWARDS.tokenBonus
          } vpl Tokens Free!`;
      } else {
        text = "";
      }
      return text;
    };
    return (
      <DownloadStateConsumer>
        {({ currentState, changeState, config }) => (
          <React.Fragment>
            {config ? <div id="group">
              <div id="img-block">
                <div>

                  <img src={config.config.groupInfo.img}></img>
                </div>
              </div>
              <div id="info-block">
                <h4>JOIN vpl GROUP</h4>
                <h3>{config.config.groupInfo.name}</h3>
                <h5>Win REAL CASH in Games, Fantasy and Rummy!</h5>
              </div>
              <style jsx>{`
              #group{
                padding-top:48px;

              #img-block{
                         background-image:url("../static/group/img_groups_bg.png") ;
                         width: 100%;
                         padding-top:12vh;
                height: 70vh;
            background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    img{
      width: 30vw;
      height: 30vw;
      border-radius:15vw;
      border: 4px #ffe72d solid;
  
    }
                     }
                     #info-block{
                      margin-top: -45vh;
                      margin-bottom: 15vh;
                       h4{
                         color:#802c2f38;
                         font-size: 16px;
                       }
                       h3{
                        color:#2c2f38;
                        text-transform: capitalize;
                        font-size: 22px;
                        padding: 5px 0 10px 0;
                       }
                       h5{
                        
                        font-size: 14px;
                         color:#2c2f38;
                       }
                     }
                    }
            `}</style>

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
            </div> : <React.Fragment></React.Fragment>}
          </React.Fragment>
        )}
      </DownloadStateConsumer>
    );
  }
}

// {this.state && this.state.osType !== "desktop" ? (
//   <div id="download-bar">
//     <DownloadButton />

//     <div>
//       <a href="" />
//     </div>
//     <div>{getText(config.config)}</div>
//   </div>
// ) : (
//   ""
// )}