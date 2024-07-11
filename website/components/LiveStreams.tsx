import React, { Component } from 'react';




class LiveStreams extends Component {
    
   
  

    render() {
        if(!this.props.liveStreams)
            return <></>;

        return (
            <section>
                <div className="container">
                    <div className="section-layout">
                        {this.props.header &&<h2 className="news__feed_heading">{this.props.header}</h2>}
                        {this.props.infoLiveStreams &&<h3 className="live__stream__info">{this.props.infoLiveStreams}</h3>}
                        {this.props.infoLiveStreams && this.props.liveStreams.map((stream,key) =>(
                            <div className="stream__css" key={key}>
                                {stream.imageUrl && <img src={stream.imageUrl.png} className="stream__banner" alt={stream.imageUrl.alt} />}
                                <div className="match__info">
                                    {stream.evetnImageUrl && <img src={stream.evetnImageUrl.png} className="match__image" alt={stream.evetnImageUrl.alt} />}
                                    <div className="match__info">
                                        <div className="match__text__area">
                                            {stream.title &&<h3 className="match__title">{stream.title}</h3>}
                                            {stream.match &&<h4 className="match__subtitle">{stream.match}</h4>}
                                        </div>
                                        <div className="live__icon">
                                            {stream.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="channels">
                                    {stream.ytStream && (
                                        <a href={stream.ytStream.link} className="channel__link">
                                            <div className="channel__name_icon">
                                                <img src={stream.ytStream.imageUrl.png} className="yt__image" alt="yt stream" />
                                                <h3 className="channel__name">YouTube</h3>
                                            </div>
                                        </a>
                                    )}
                                     {stream.fbStream && (
                                        <a href={stream.fbStream.link} className="channel__link">
                                            <div className="channel__name_icon">
                                                <img src={stream.fbStream.imageUrl.png} className="fb__image" alt="fb stream" />
                                                <h3 className="channel__name">Facebook</h3>
                                            </div>
                                        </a>
                                    )}
                                     {stream.twStream && (
                                        <a href={stream.twStream.link} className="channel__link">
                                            <div className="channel__name_icon">
                                                <img src={stream.twStream.imageUrl.png} className="tw__image" alt="tw stream" />
                                                <h3 className="channel__name">Twitch</h3>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                
                </div>
                <style jsx>{`
                    
                    h2,h3,h4{
                        margin:0;
                    }
                    section{
                        background:#fff;
                        margin: 0px 8px;
                        margin-bottom: -1px;
                    }
                    .section-layout{
                        padding: 16px;
                    }
                    .news__feed_heading{
                        font-style: normal;
                        font-weight: bold;
                        font-size: 20px;
                        line-height: 28px;
                        text-align:left;
                        color: #190A28;
                        margin-bottom:4px;
                    }
                    .live__stream__info{
                        font-weight: normal;
                        font-size: 12px;
                        line-height: 16px;
                        color: rgba(25, 10, 40, 0.6);
                        text-align:left;
                        margin-bottom:8px;
                    }
                    .stream__banner{
                        margin-bottom:8px;
                        border-top-left-radius: 8px;
                        border-top-right-radius: 8px;
                        width:100%;
                    }
                    .match__info{
                        display:flex;
                    }
                    .match__image{
                        width: 32px;
                        height: 32px;
                        border-radius: 2px;
                    }
                    .match__text__area{
                        margin-left:8px;
                    }
                    .stream__css{
                        margin-bottom:16px;
                    }
                    .live__icon{
                        margin-left:8px;
                        background: #E91051;
                        border-radius: 4px;
                        font-weight: 500;
                        font-size: 10px;
                        line-height: 20px;
                        color: #FFFFFF;
                        height: 20px;
                        padding:0px 12px;
                    }
                    .channels{
                        margin-left: 32px;
                        margin-top:8px;
                        display:flex;
                        justify-content: start;
                    }
                    .yt__image{
                        width:14px;
                        height:10px;
                    }
                    .fb__image{
                        width:14px;
                        height:14px;
                    }
                    .tw__image{
                        width:16px;
                        height:16px;
                    }
                    .channel__link{
                        background: #F9E2F0;
                        border-radius: 20px;
                        padding:6px 8px;
                        margin:4px;
                        display: flex;
                    }
                    .channel__name{
                        font-weight: 500;
                        font-size: 10px;
                        line-height: 12px;
                        color: #190A28;
                        margin-left:4px;
                    }
                    .match__title{

                        font-weight: 500;
                        font-size: 14px;
                        line-height: 20px;
                        color: #190A28;
                        text-align:left;

                    }
                    .match__subtitle{
                        font-weight: normal;
                        font-size: 12px;
                        line-height: 16px;
                        text-align: left;
                        color: rgba(25, 10, 40, 0.6);
                    }
                    .channel__name_icon{
                        display: flex;
                        align-items: center;
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
                            margin-bottom:8px;
                            text-align:center;
                        }
                        .section-layout {
                            padding:24px;
                        }
                        .live__stream__info{
                            font-size: 16px;
                            line-height: 20px;
                            margin-bottom:16px;
                            text-align:center;
                        }

                        .stream__banner{
                            margin-bottom:16px;
                            border-top-left-radius: 4px;
                            border-top-right-radius: 4px;
                        }
                       
                        .match__image{
                            width: 64px;
                            height: 64px;
                            border-radius: 2px;
                        }
                        .match__text__area{
                            margin-left:16px;
                        }
                        .stream__css{
                            margin-bottom:24px;
                        }
                        .live__icon{
                            margin-left:16px;
                            font-size: 16px;
                            line-height: 24px;
                            height: 24px;
                            padding:0px 12px;
                        }
                        .channels{
                            margin-left: 64px;
                            margin-top:16px;
                        }
                        .yt__image{
                            width:27px;
                            height:19px;
                        }
                        .fb__image{
                            width:27px;
                            height:27px;
                        }
                        .tw__image{
                            width:32px;
                            height:32px;
                        }
                        .channel__link{
                            border-radius: 30px;
                            padding:15px 18px;
                            margin:16px;
                        }
                        .channel__name{
                            font-weight: 500;
                            font-size: 16px;
                            line-height: 20px;
                            margin-left:8px;
                        }
                        .match__title{
                            font-size: 20px;
                            line-height: 24px;
                        }
                        .match__subtitle{
                            font-size: 16px;
                            line-height: 20px;
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

                        .match__image{
                            width: 80px;
                            height: 80px;
                            border-radius: 2px;
                        }

                        .match__text__area{
                            margin-left:24px;
                        }
                        .stream__css{
                            margin-bottom:24px;
                        }

                        .live__icon{
                            font-size: 20px;
                            line-height: 32px;
                            height: 32px;
                            padding:0px 16px;
                        }
                       
                        .channel__name{
                            font-weight: 500;
                            font-size: 20px;
                            line-height: 28px;
                            margin-left:8px;
                        }
                        .match__title{
                            font-size: 24px;
                            line-height: 32px;
                        }
                        .match__subtitle{
                            font-size: 20px;
                            line-height: 28px;
                        }
                        
                    }
                            
                `}</style>
            </section>
        );
    }
}

export default LiveStreams;