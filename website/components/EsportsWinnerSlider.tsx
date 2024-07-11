export const EsportsWinnerSlider = (props) => {
    if(!props.imageList)
        return <></>;
    return (
    <section>
        <div className="container">
            <div className="section-layout">
                <h2 className="news__feed_heading">{props.header}</h2>
                <div className="winner--cards--container scrollable-section">
                    {props.imageList && (<>
                        {props.imageList.map((card,key)=> (<a key={key} className="winner--card">
                                    <div className="wrapper__event__game"> 
                                        <img
                                            src={card.eventNameUrl.png}
                                            alt={card.eventNameUrl.alt}
                                            className="event__image"
                                        />
                                        <div className="game__name__icon__wrapper">
                                            <img
                                                src={card.gameImageUrl.png}
                                                alt={card.gameImageUrl.alt}
                                                className="game__icon"
                                            />
                                        </div>
                                    </div>
                                    <img
                                        src={card.imageurl.png}
                                        alt={card.imageurl.alt}
                                        className="winner__image"
                                    />
                                    <h3 className="winner__name">{card.cardContent.name}</h3>
                                    <h3 className="winner__tour">{card.cardContent.tournament_name}</h3>
                                    <h3 className="winner__won">{card.cardContent.won}</h3>
                                
                        </a>))}
                    </>)}
                </div>
            </div>
        </div>
        <style jsx>
          {`
            h3{
                margin:0;
            }

            section{
                background:#fff;
                margin: 0px 8px;
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

            .winner__image{
                width: 155px;
                height: 155px;
                margin:auto;
            }
            .winner--card{
                background: #F9E2F0;
                border-radius: 8px;
                margin-right:12px;
                min-width: 240px;
                padding-bottom:24px;
            }
            .winner__name{
                font-weight: 500;
                font-size: 16px;
                line-height: 24px;
                text-align: center;
                color: #190A28;
                font-weight: 500;
                margin-top:8px;

            }
            .winner__tour{
                font-weight: normal;
                font-size: 14px;
                line-height: 20px;
                text-align: center;
                color: #190A28;
            }
            .winner__won{
                font-weight: 900;
                font-size: 28px;
                line-height: 33px;
                text-align: center;
                color:FF007A;
                margin-top:8px;
                background: linear-gradient(#ff007a,#ff3d00);
                background-clip: text;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;

            }
            .wrapper__event__game{
                display: flex;
                justify-content: space-between;
                padding: 10px;
                margin-bottom: -30px;
            }
            .event__image{
                width:65px;
                height:60px;
                display:block;
            }
            .game__name__icon__wrapper{
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .game__icon{
                width:60px;
                height:60px;
                display:block;
            }
            .game__name__icon{
                width:45px;
                height:25px;
                display:block;
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
                .winner--card{
                    margin-right: 24px;
                    min-width: 288px;
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