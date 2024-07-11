export const EsportsGameInfo = (props) => {
  return (
    <section
      className={`esports-game-info-section ${props.page} ${props.device} ${props.cssClassList ? props.cssClassList.join('') : ''} `}
    >
      <div className="container">
        <div className="section-layout">
          <div className="row prize-info">
            <span>
              {" "}
              <img src={props.trophyImageurl.png} />
            </span>
            <div className="">
              <span className="prize-money">
                <strong>{props.prizeMoney}</strong>
              </span>
              <span className="game-name">{props.gameName}</span>
            </div>
            <span>
              <img src={props.trophyImageurl.png} />
            </span>
          </div>
          <div className="row">
            <div className="game-stats-container">
              {props.tournamentStatsList.map((stats, index) => (
                <div className="game-stats" key={index}>
                  <span className="game-stats-numbers">{stats.count}</span>
                  <span className="game-stats-text">{stats.header}</span>
                </div>
              ))}
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
          .prize-info div {
            display: flex;
            flex-direction: column;
          }
          .prize-money {
            font-weight: 900;
            font-size: 32px;
            line-height: 37px;
            margin-bottom: 4px;
            margin: 0 12px 4px 12px;
          }

          .game-name {
            font-weight: normal;
            font-size: 12px;
            line-height: 16px;
            color: rgba(25, 10, 40, 0.6);
          }
          .game-stats {
            display: flex;
            flex-direction: column;
            width:60px;
          }

          .game-stats-numbers {
            font-weight: bold;
            font-size: 20px;
            line-height: 26px;
            color: #190a28;
          }
          .game-stats-text {
            font-size: 12px;
            line-height: 16px;
            color: rgba(25, 10, 40, 0.6);
          }
          .game-stats-container {
            min-width: 180px;
            display: flex;
            justify-content: space-between;
            padding: 24px 0 0 0;
          }
          .prize-info img {
            width: 48px;
            height: 48px;
          }
          .esports-game-info-section.esports-prize-distribution{
            background:#fff;
           .prize-info {
            justify-content: center;
           }
          }
          @media screen and (min-width: 1224px) {
            .game-stats {
             
              width:80px;
            }
            .prize-info img {
              width: auto;
              height: auto;
            }

            .game-name { 
              font-size: 18px;
            }

            .prize-money{
              margin-bottom: 18px;
            }
            
            .game-stats-numbers {
              font-size: 25px;
             }
            .game-stats-text {
              font-size: 14px;
             
            }

          }
        `}
      </style>
    </section>
  );
};
