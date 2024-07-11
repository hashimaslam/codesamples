import osType from "../configs/detectOs";
import React, { Component } from "react";
export default class extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const getText = (config) => {
      let text = "";
      let language = config.LANG_CODE;
      let cashBonus = config.referral
        ? config.referral.cashBonus
        : config.REWARDS.cashBonus;
      let cash = "";
      // language === "id"
      //   ? (cash = `${cashBonus} ${this.props.rewardsBar.currency}`)
      //   : (cash = `${this.props.rewardsBar.currency}${cashBonus}`);

        language === "id"
        ? (cash = `${cashBonus} ${this.props.rewardsBar.currency}`)
        : (cash = `${this.props.rewardsBar.currency}${cashBonus}`);

      if (config.referral) {
        text = `${this.props.rewardsBar.joiningBonusText} ${cash} + ${config.referral.tokenBonus} ${this.props.rewardsBar.tokenFreeText}`;
      } else {
        if (config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `${this.props.rewardsBar.joiningBonusText} ${cash} + ${config.REWARDS.tokenBonus} ${this.props.rewardsBar.tokenFreeText}`;
        } else if (config.REWARDS.cashBonus && !config.REWARDS.tokenBonus) {
          text = `${this.props.rewardsBar.joiningBonusText} ${cash} ${this.props.rewardsBar.freeText}`;
        } else if (!config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `${this.props.rewardsBar.joiningBonusText} ${config.REWARDS.tokenBonus} ${this.props.rewardsBar.tokenFreeText}`;
        } else {
          text = "";
        }
      }
      return text;
    };
    return (
      <div>
        {this.props.device !== "desktop" ? (
          typeof this.props.rewardsBar.showRewards !== "undefined" ? (
            this.props.rewardsBar.showRewards ? (
              <div className="reward-bar">
                {this.props.config ? getText(this.props.config.config) : ""}
              </div>
            ) : (
              ""
            )
          ) : (
            <div className="reward-bar">
              {this.props.config ? getText(this.props.config.config) : ""}
            </div>
          )
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
