import * as imgRef from "../configs/images";
import "../styles/stats.scss";
const Stats = props => (
  <div id="stats">
    <div>
      <img src={imgRef.STAT3} alt="" />

      <div className="txt-heading">
        <h4>Players</h4>
      </div>
    </div>
    {props.pageType === "SUPERTEAM" ? (
      <div>
        <img src={imgRef.CONTEST_ICON} alt="" />
        <div className="txt-heading">
          <h4>Daily Contests</h4>
        </div>
      </div>
    ) : (
      <div>
        <img src={imgRef.STAT2} alt="" />
        <div className="txt-heading">
          <h4>30+ Mobile Games</h4>
        </div>
      </div>
    )}

    <div>
      <img src={imgRef.STAT1} alt="" />

      <div className="txt-heading">
        <h4>Daily Winners</h4>
      </div>
    </div>
    <style jsx>{``}</style>
  </div>
);
export default Stats;
