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
      language === "id"
        ? (cash = `${cashBonus} ${this.props.rewardsBar.currency}`)
        : (cash = `${this.props.currency}${cashBonus}`);

      if (config.referral) {
         if(config.referral.tokenBonus && config.referral.tokenBonus > 0){
          text = `${this.props.joiningBonusText} ${cash} + ${config.referral.tokenBonus} ${this.props.tokenFreeText}`;
         }
         else {
          text = `${this.props.joiningBonusText} ${cash}`;
         }
        
      } else {
        if (config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `${this.props.joiningBonusText} ${cash} + ${config.REWARDS.tokenBonus} ${this.props.tokenFreeText}`;
        } else if (config.REWARDS.cashBonus && !config.REWARDS.tokenBonus) {
          text = `${this.props.joiningBonusText} ${cash} ${this.props.freeText}`;
        } else if (!config.REWARDS.cashBonus && config.REWARDS.tokenBonus) {
          text = `${this.props.joiningBonusText} ${config.REWARDS.tokenBonus} ${this.props.tokenFreeText}`;
        } else {
          text = "";
        }
      }
      return text;
    };

    if (this.props.osType === "ios" || this.props.osType == "android") {
      if (this.props.showCarousel === true) {
        return <></>;
      }
    }

    return (
      <div>
        {this.props.device !== "desktop" ? (
          <>
            <div
              className={`rewards-bar-container body-extra-large trim-BoldItalic uppercase ${
                this.props.cssClasses ? this.props.cssClasses : ""
              } `}
              style={this.props.styles}
            >
              <div className="rewards-bar">
                <div
                  className={`rewards-bar-text body-extra-large trim-BoldItalic uppercase m-0 ${
                    this.props.cssClasses ? this.props.cssClasses : ""
                  } `}
                  style={this.props.styles}
                >
                  {this.props.config ? getText(this.props.config.config) : ""}{" "}
                  {""} &nbsp; &nbsp;
                  {this.props.config
                    ? getText(this.props.config.config)
                    : ""}{" "}
                  {""} &nbsp; &nbsp;
                  {this.props.config
                    ? getText(this.props.config.config)
                    : ""}{" "}
                  {""} &nbsp; &nbsp;
                  {this.props.config
                    ? getText(this.props.config.config)
                    : ""}{" "}
                  {""} &nbsp; &nbsp;
                  {this.props.config
                    ? getText(this.props.config.config)
                    : ""}{" "}
                  {""} &nbsp; &nbsp;
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        <style global jsx>{`
          .rewards-bar-container {
            height: 29px;
            overflow: hidden;
            position: relative;
            width: 100vw;
            max-width: 100%;
            overflow-x: hidden;
          }

          .rewards-bar {
            position: absolute;
            white-space: nowrap;
            will-change: transform;
            animation: marquee 8s linear infinite;
          }

          .rewards-bar-text {
            float: left;
            font-size: 24px;
            width: 100%;
          }

          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    );
  }
}
