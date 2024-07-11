import { getHTML } from "../configs/util";
export const EsportsGameInfo = (props) => {
  return (
    <section
      className={`esports-game-info-section ${props.page} ${props.device} `}
    >
      <div className="container">
        <div className="section-layout">
          <div className="row prize-info">
            <span>
              {" "}
              <img src="/static/2x/trophy.png" />
            </span>
            <div className="">
              <span className="prize-money">
                <strong>₹30,000</strong>
              </span>
              <span className="game-name">League Prize Pool</span>
            </div>
            <span>
              <img src="/static/2x/trophy.png" />
            </span>
          </div>
          <div className="row">
            <div className="game-stats-container">
              <div className="game-stats">
                <span className="game-stats-numbers">2</span>
                <span className="game-stats-text">Colleges</span>
              </div>
              <div className="game-stats">
                <span className="game-stats-numbers">3</span>
                <span className="game-stats-text">Games</span>
              </div>
              <div className="game-stats">
                <span className="game-stats-numbers">120</span>
                <span className="game-stats-text">Winners</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>
        {`
          .page-info-section a {
            all: inherit;
            display: inline;
            cursor: pointer;
            color: #ff0000;
            font-weight: 500;
          }
        `}
      </style>
      <style jsx>
        {`
         
        `}
      </style>
    </section>
  );
};
