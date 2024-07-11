export const TestimonialsSlider = (props) => {
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
                                    <div className="image__wrapper__cricle">
                                        <img
                                            src={card.imageurl.png}
                                            alt={card.imageurl.alt}
                                            className="winner__image"
                                        />
                                    </div>
                                    <div className="message__icon">
                                        <svg  className="svg__position" fill="none" height="21" viewBox="0 0 38 21" width="38" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m1.45482 18.8027 34.35018-18.677896c.7929-.431134 1.7061.32576 1.4296 1.184886l-6.0113 18.67791c-.133.4134-.5177.6936-.9519.6936h-28.33888c-1.036711 0-1.388476-1.3833-.4777-1.8785z" fill="#680485" fill-rule="evenodd" opacity=".2"/></svg>
                                    </div>
                                    <div className="winner__testimonial">
                                        <div>
                                           
                                            <div className=" text__area">
                                                <h3 className="winner__name">{card.cardContent.name}</h3>
                                                <h3 className="winner__location">{card.cardContent.location}</h3>
                                                <h3 className="winner__info">{card.cardContent.info}</h3>
                                            </div>
                                        </div>
                                       
                                      
                                       
                                    </div>
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
            .winner__image{
                width: 80px;
                height: 80px;
            }
            .image__wrapper__cricle{
                height: 88px;
                width: 96px;
                border-radius: 50%;
                background: #230046;
                position: absolute;
                margin-left: 135px;
            }
            .winner__testimonial{
                background-color:rgba(104,4,133,0.2);
                border-radius: 8px;
            }
            .text__area{
                margin-top:40px;
                padding:16px;
            }
            .winner--card{
                background: #230046;
                border-radius: 8px;
                margin:8px;
                max-width: 248px;
                min-width: 248px;
                padding:32px 16px;
                position:relative;
            }
            .winner__name{
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                color: #33FF66;
                text-align:left;
            }
            .winner__location{
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                color: #F4F3F4;
                text-align:left;
                margin-bottom:12px;

            }
            .winner__info{
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                text-align:left;
                color: #FFFFFF;

            }
            .message__icon{
                position: absolute;
            }
            .svg__position{
                margin-bottom: -28px;
                margin-left: 80px;
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
                .winner__name{
                    font-weight: 500;
                    font-size: 20px;
                    line-height: 28px;
                    color: #33FF66;
                    text-align:left;
                }
                .winner__location{
                    font-weight: normal;
                    font-size: 20px;
                    line-height: 28px;
                    color: #F4F3F4;
                    text-align:left;
                    margin-bottom:12px;
    
                }
                .winner__info{
                    font-weight: normal;
                    font-size: 20px;
                    line-height: 28px;
                    text-align:left;
                    color: #FFFFFF;
    
                }
                .winner--card{
                    max-width: 400px;
                    min-width: 400px;
                }
                .text__area{
                    padding:24px;
                }
                .winner__image{
                    width: 133px;
                    height: 133px;
                }
                .image__wrapper__cricle{
                    height: 145px;
                    width: 170px;
                    margin-left: 208px;
                }
                .text__area{
                    margin-top:70px;
                }
                .svg__position{
                    margin-bottom: -55px;
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