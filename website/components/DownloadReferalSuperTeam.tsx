import * as txt from "../configs/home_data";
import * as imgRef from "../configs/images";
import SendSMSStatic from "../components/SendSMSStatic";
import { IC_COIN } from "../configs/images";
import "../styles/landing-page.scss";
const DownloadReferral = (props) => (
  <div
    id="landing"
    className="referral superteam"
    style={{
      backgroundImage: `url(${imgRef.SUPERTEAM_BACKGROUND})`,
      backgroundPosition: "center",
    }}
  >
    <div className="head" />
    <div className="landing-section">
      <div className="">
        <div className="referral-sec">
          <div>
            <h4>{props.referralData.displayName}</h4>
            <p>{txt.REFERRAL_USER_TAGLINE}</p>
          </div>
          <div className="card">
            <p>
              {props.referralData.cashBonus && !props.referralData.tokenBonus
                ? "GET FREE CASH"
                : ""}
              {props.referralData.tokenBonus && !props.referralData.cashBonus
                ? "GET FREE TOKENS"
                : ""}
              {props.referralData.cashBonus && props.referralData.tokenBonus
                ? "GET FREE CASH & TOKENS"
                : ""}
            </p>
            <div id="referral-bonus">
              {props.referralData.cashBonus ? (
                <h2 id="cash">
                  {" "}
                  &#8377;
                  {props.referralData.cashBonus}{" "}
                </h2>
              ) : (
                ""
              )}
              {props.referralData.tokenBonus && props.referralData.cashBonus ? (
                <h2>+</h2>
              ) : (
                ""
              )}
              {props.referralData.tokenBonus ? (
                <span style={{ display: "flex" }}>
                  <h2>{props.referralData.tokenBonus}</h2>
                  <img src={IC_COIN} alt="Tokens" />
                </span>
              ) : (
                ""
              )}
            </div>
            <p className="ref1">{txt.REFERRAL_CARD2}</p>
            <h4 className="ref1">{props.referralData.referralCode}</h4>
          </div>
          {/* <div>
          <p>
            <span>{txt.REFERRAL_MONEY_TXT1}</span>
            <span>
              &#8377;
              {props.referralData.cashBonus}
            </span>
            <span>{txt.REFERRAL_MONEY_TXT2}</span>
          </p>

          <h3>{txt.REFERRAL_USER_SUBHEADING}</h3>
        </div> */}
        </div>

        <SendSMSStatic referralData={props.referralData} />
      </div>

      <div className="landing-sec">
        <img src={imgRef.SUPERTEAM_RAHUL} alt="vpl App Screen" />
      </div>
    </div>
    <style jsx>{`
      @media (min-width: 1200px) {
      }
    `}</style>
  </div>
);
export default DownloadReferral;
