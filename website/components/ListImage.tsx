export const ListImage = (props) => {
  
  const linkClicked = (linkname) => {
    if(window.location.pathname === "/esports/arena" ||  window.location.pathname === "/esports/dailyseries"){
  window.dataLayer = window.dataLayer || [];
  let eventName = "";
  switch(linkname.toLowerCase()){
    case "prizes distribution": 
     eventName = "Prizes_distribution";
     break;
     case "league rules, league format & terms and conditions": 
     eventName = "League_Rules";
     break;
     case "help & faqs": 
     eventName = "Help&FAQs";
     break;
  }
 
  window.dataLayer = window.dataLayer || []; 
  window.dataLayer.push({
    event: eventName,
    ButtonName:linkname,
    LocationOfAction:"top_menu",
    Game:""
  });

  }
 }

  return (
    <section
      className={`list-image  ${
        props.cssClassList ? props.cssClassList.join(" ") : ""
      } ${props.device} ${props.page}`}
    >
      <div className="container">
        <div className="section-layout">
          <div className="row list-image-layout">
            {props.header ? (
              props.H1Header ? (
                <h1 className="section-header section-header--medium main-header">
                  {props.header}
                </h1>
              ) : (
                <h2 className="section-header section-header--medium">
                  {props.header}
                </h2>
              )
            ) : (
              ""
            )}
            {props.subHeader ? (
              <h2 className="section-header section-header--medium">
                {props.subHeader}
              </h2>
            ) : (
              ""
            )}
            <div>
              {props.informationList.map((content, index) => {
                return content.navigateTo ? (
                  <a href={content.navigateTo} target={content.target_blank ? "_blank":''} onClick={() => linkClicked(content.title)} key={index}>
                    <div key={index} className="tournaments">
                      <div className="tournaments-icon">
                        {/* <img src={content.imageurl.png}></img> */}
                        <picture>
                          <source
                            srcSet={content.imageurl.webp}
                            type="image/webp"
                          />
                          <source
                            srcSet={content.imageurl.png}
                            type="image/png"
                          />
                          <img src={content.imageurl.png} />
                        </picture>
                      </div>
                      <div className="tournament-details">
                        <span className="tournament-date">{content.title}</span>
                        <span className="tournaments-perks">
                          <span className="tournament-date-details">
                            {content.date}{" "}
                          </span>
                          <span className="tournament-time">
                            {content.time}{" "}
                          </span>
                        </span>
                      </div>
                      {content.rightImageurl && (
                        <img src={content.rightImageurl.png} />
                      )}
                    </div>
                  </a>
                ) : (
                  <div key={index} className="tournaments">
                    <div className="tournaments-icon">
                      <img src={content.imageurl.png}></img>
                    </div>
                    <div className="tournament-details">
                      <span className="tournament-date">{content.title}</span>
                      <span>
                        {content.date}
                        {content.time}
                      </span>
                    </div>
                    {content.rightImageurl && (
                      <img src={content.rightImageurl.png} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .list-image {
            background: #f0f0f0;
          }
          .list-image-layout {
            flex-direction: column;
          }
          .tournaments {
            display: flex;
            padding: 12px;
            background: #ffffff;
            border-radius: 4px;
            margin: 4px 0 4px 0;
            box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.2);
            .tournaments-icon {
              margin-right: 12px;
              width: 32px;
              height: 32px;
            }
            .tournament-details {
              display: flex;
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
              color: #828282;
              font-weight: normal;
              align-items:center;
              width: 100%;
              justify-content: start;
              padding-right: 30px;
              text-align: left;
            }
            .tournament-date {
              margin-bottom: 4px;
              color: #4a4a4a;
              font-weight: 500;
            }
          }
          .list-image.esports-points-distribution {
            background: #fff;
            .tournaments {
              box-shadow: none;
            }
          }
          .list-image.esports-prize-distribution {
            background: #fff;
            .tournaments {
              box-sizing: border-box;
              box-shadow: none;
            }
            .tournaments-perks {
              display: inline-block;
              text-align: left;
            }
            .tournament-date {
              font-weight: 500;
              font-size: 16px;
              line-height: 24px;
              color: #190a28;
              margin-bottom: 0;
            }
            .tournament-date-details {
              display: block;
              font-size: 16px;
              line-height: 24px;
              color: rgba(25, 10, 40, 0.6);
              // margin-bottom: 4px;
            }
            .tournament-time {
              font-weight: normal;
              font-size: 12px;
              line-height: 16px;
              color: rgba(25, 10, 40, 0.6);
              white-space: pre-line;
            }

            .tournaments-icon {
              width: auto;
              height: auto;
              img {
                width: 80px;
                height: 80px;
                max-width: fit-content;
              }
            }
          }
          @media screen and (min-width: 1224px) {
            .list-image {
              background: #fff;
            }
            .tournaments {
              border: solid 1px #f0f0f0;
              .tournament-details {
                font-size: 16px;
                .tournament-date {
                  font-size: 18px;
                }
              }
            }
          }
        `}
      </style>
    </section>
  );
};
