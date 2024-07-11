
import {getHTML} from "../configs/util";
export const EnteringTheTournament = (props) => (
  <section className={`tournament-section ${props.cssClassList? props.cssClassList.join(' ') :''}`}>
    <div className="container">
      <div className="section-layout">
      
          <div className="row">
            {" "}
            <h2 className="section-header section-header--medium">
              {props.header}
            </h2>
          </div>
        {props.description ? (
          <div className="row tournament-align-row">
            <p className="section-header--small">{getHTML(props.description)}</p>
          </div>
        ) : (
          ""
        )}
        <div className="row tournament-row">
          {props.contentList
            ? props.contentList.map((step, key) => (
                <div className="tournament-steps-tile" key={key}>
                  <h6 className="section-header section-header--small tournament-steps__title">
                    {step.stepTitle}
                  </h6>
                  <div className="section-header--small tournament-steps-block">
                    {step.stepInfo && step.stepInfo.map((info, key) => (
                      <p className="section-header--small" key={key}>{getHTML(info)}</p>
                    ))}
                  </div>
                  {step.imageurl ? (
                    <React.Fragment>
                      <div className="tournament-steps__image-wrapper">
                        <img
                          data-src={step.imageurl.png}
                          className="lazy-image"
                          alt={step.stepTitle}
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                        />
                      </div>
                      <noscript>
                        <img src={step.imageurl.png} alt={step.stepTitle} />
                      </noscript>
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                </div>
              ))
            : ""}
        </div>
      </div>
    </div>
    <style jsx global>
      {`
        .tournament-section a {
          all: inherit;
          display: inline;
          cursor: pointer;
          color: #ff0000;
          font-weight:500;
        }
      `}
    </style>
    <style jsx>
      {`
        
        .tournament-colored{
          background-color: #f0f0f0;
        }
        .tournament-section a {
          all: inherit;
          display: inline;
          cursor: pointer;
          color: #ff0000;
          font-weight:500;
        }
        .tournament-section {
          .tournament-steps-tile {
            justify-content: center;
            flex-direction: column;
            text-align: left;
            margin-bottom:16px;
          }

          .tournament-align-row{
              text-align:left;
          }

          .tournament-steps__title {
            margin-bottom: 8px;
            color: #828282;
            font-weight: bold;
            text-transform: uppercase;
            }
          .tournament-row {
            flex-direction: column;
          }
        }
        .tournament-steps__image-wrapper {
          img {
            width: 100%;
            height: 176px;
            border-radius: 4px;
            object-fit: cover;
          }
        }

        @media screen and (min-width: 768px) {
          .tournament-colored{
            background-color: #fff;
          }
          .tournament-section {
            .tournament-steps-tile {
              text-align: center;
              margin-bottom:0;
            }
          }
          .tournament-steps-block {
            margin: 18px 0;
          }
          .tournament-align-row{
            text-align:center;
        }

          .tournament-steps__image-wrapper {
            img {
              width: 540px;
              height: 304px;
            }
          }
        }
      `}
    </style>
  </section>
);
