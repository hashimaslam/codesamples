import osType from "../configs/detectOs";
import React, { Component } from "react";
export default class extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    showDownload: false,
  };
  componentDidMount() {
    this.setState({
      osType: osType(),
      showDownload: true,
    });
  }
  render() {
    const getText = (config) => {
      let text = "";
      if (config.referral) {
        text = `Joining Bonus: Get ₹${config.referral.cashBonus} + ${config.referral.tokenBonus} vpl Tokens Free!`;
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
      <div>
        {this.state.showDownload && this.state.osType !== "desktop" ? (
          <div>
            <div className="reward-bar">
              {this.props.config ? getText(this.props.config.config) : ""}
            </div>
          </div>
        ) : (
          ""
        )}
        <style global jsx>{`
          .reward-bar {
            padding: 5px;
            font-stretch: condensed;
            text-align: center;
            background-color: #ffe500;
            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 14px;
            line-height: 18px;
            text-align: center;
            color: #222222;
          }
        `}</style>
      </div>
    );
  }
}
