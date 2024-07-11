export const MatchVideos = (props) => {
    if(!props.videoList)
        return <></>;
    return (
    <section>
        <div className="container">
            <div className="section-layout">
                <h2 className="news__feed_heading">{props.header}</h2>
                <div className="winner--cards--container scrollable-section">
                    {props.videoList && (<>
                        {props.videoList.map((card,key)=> (<a key={key} className="winner--card">
                                   
                                    <iframe className="video__section" src={card.url}>
                                    </iframe>
                                   <div className="video__info__section">
                                        <img src={card.gameImgUrl.png} className="black__rectangel" alt={card.gameImgUrl.alt} />
                                        <div className="info__section">
                                            <h3 className="video__name">{card.name}</h3>
                                            <h4 className="video__event">{card.eventName}</h4>
                                        </div>
                                   </div>
                        </a>))}
                    </>)}
                </div>
            </div>
        </div>
        <style jsx>
          {`
            h3,h4{
                margin:0;
            }

            section{
                background:#fff;
                margin: 0px 8px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                margin-bottom: -1px;
            }
            .section-layout{
                padding: 16px ;
            }
            .news__feed_heading{
                font-style: normal;
                font-weight: bold;
                font-size: 20px;
                line-height: 28px;
                text-align:left;
                color: #190A28;
                margin:0;
                margin-bottom:12px;
            }
            .winner--cards--container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                &.scrollable-section{
                    flex-wrap:nowrap;
                    overflow-x:scroll;
                    justify-content: unset;
                    scroll-behavior: smooth;
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  
                    padding-bottom:0;
                }
                &.scrollable-section::-webkit-scrollbar{
                    display: none;
                }
            }
            
            .winner--card{
                margin:8px;
            }
            .video__section{
                min-width: 282px;
                height:160px;
                border-radius: 8px;
                margin-bottom:12px;
                border: none;
            }
            .black__rectangel{
                width:32px;
                height:32px;
                border-radius:4px;
            }
            .video__info__section{
                display: flex;
            }
            .info__section{
                margin-left: 12px;
            }
            .video__name{
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                display: flex;
                color: #190A28;
                text-align:left;

            }
            .video__event{
                font-weight: 500;
                font-size: 10px;
                line-height: 12px;
                color: rgba(25, 10, 40, 0.6);
                text-align:left;

            }
            
            @media screen and (min-width: 768px) {

                .section-layout{
                    max-width:700px;
                    margin:auto;
                }
                section{
                    margin: 0px 16px;
                }

                .news__feed_heading{
                    font-size: 32px;
                    line-height: 40px;
                    margin-bottom:24px;
                    text-align:center;
                }
                .section-layout {
                    padding:24px;
                }
            }
            @media screen and (min-width: 1224px) {

                .section-layout{
                    max-width:808px;
                    margin:auto;
                }
                section{
                    margin: 0px 32px;
                }

                .news__feed_heading{
                    font-size: 48px;
                    line-height: 56px;
                    margin-bottom:48px;
                }
                .section-layout {
                    padding: 56px 24px;
                }
              
            }

            
          `}
        </style>
      </section>
    );
  };