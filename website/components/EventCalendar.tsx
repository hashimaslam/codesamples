import React, { Component } from 'react';




class EventCalendar extends Component {
    
   
    
    render() {
        if(!this.props.liveEvents && !this.props.upcomingEvents && !this.props.yetToEvents)
            return <></>;
        return (
            <section>
                <div className="container">
                    <div className="section-layout">
                        <h2 className="news__feed_heading">{this.props.header}</h2>
                        { this.props.liveEvents &&(
                        <div className="live__events__section">
                            {this.props.liveEventTitle && <h3 className="event__heading__name live__header ">{this.props.liveEventTitle}</h3>}
                            <div className="live__events">
                                {this.props.liveEvents.map((eventData,key) =>(
                                    <div className="event__style" key={key}>
                                        <div className="mobile__event" >
                                            <a href={eventData.pageLink}>
                                                <div className="img__wrapper">
                                                    {eventData.mobileImageUrl && <img src={eventData.mobileImageUrl.png} alt={eventData.mobileImageUrl.alt}/>}
                                                </div>
                                                <div className="event__info">
                                                    <div className="wrapper__content">
                                                        {eventData.title && <h3 className="event__name">{eventData.title}</h3>}
                                                        {eventData.startDate && <h3 className="event__date">{eventData.startDate}</h3>}
                                                        {eventData.prize && <h3 className="event__prize">{eventData.prize}</h3>}
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                        <div className="desktop__event">
                                            <a href={eventData.pageLink}>
                                                <div className="img__wrapper">
                                                    { eventData.desktopImageUrl && <img src={eventData.desktopImageUrl.png} alt={eventData.desktopImageUrl.alt}/>}
                                                </div>
                                                <div className="event__info">
                                                    <div className="wrapper__content">
                                                        {eventData.title && <h3 className="event__name">{eventData.title}</h3>}
                                                        {eventData.startDate && <h3 className="event__date">{eventData.startDate}</h3>}
                                                        {eventData.prize && <h3 className="event__prize">{eventData.prize}</h3>}
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>)}
                        { this.props.upcomingEvents && (<div className="upcoming__events__section">
                            {this.props.upcomingEventTitle && <h3 className="event__heading__name upcoming__header">{this.props.upcomingEventTitle}</h3>}
                            <div className="upcoming__events">
                                {this.props.upcomingEvents.map((eventData,key) =>(
                                    <div className="event__style" key={key}>
                                         <div className="mobile__event" >
                                            <a href={eventData.pageLink}>
                                                <div className="img__wrapper">
                                                    {eventData.mobileImageUrl && <img src={eventData.mobileImageUrl.png} alt={eventData.mobileImageUrl.alt}/>}
                                                </div>
                                                <div className="event__info">
                                                    <div className="wrapper__content">
                                                        {eventData.title && <h3 className="event__name">{eventData.title}</h3>}
                                                        {eventData.startDate && <h3 className="event__date">{eventData.startDate}</h3>}
                                                        {eventData.prize && <h3 className="event__prize">{eventData.prize}</h3>}
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                        <div className="desktop__event">
                                            <a href={eventData.pageLink}>
                                                <div className="img__wrapper">
                                                    {eventData.desktopImageUrl &&<img src={eventData.desktopImageUrl.png} alt={eventData.desktopImageUrl.alt}/>}
                                                </div>
                                                <div className="event__info">
                                                    <div className="wrapper__content">
                                                        {eventData.title && <h3 className="event__name">{eventData.title}</h3>}
                                                        {eventData.startDate && <h3 className="event__date">{eventData.startDate}</h3>}
                                                        {eventData.prize && <h3 className="event__prize">{eventData.prize}</h3>}
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>)}
                        { this.props.yetToEvents && (<div className="yet__events__section">
                            {this.props.yetToAnnounceTitle && <h3 className=" event__heading__name yet__header">{this.props.yetToAnnounceTitle}</h3>}
                            <div className="yet__events">
                                {this.props.yetToEvents.map((eventData,key) =>(
                                    <div className="yet__event__style" key={key}>
                                        { eventData.title && <h3 className="yet__event__name">{eventData.title}</h3>}
                                        {eventData.startDate && <h4 className="yet__subtitle">{eventData.startDate}</h4>}
                                    </div>
                                ))}
                            </div>
                        </div>)}
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
                        margin-bottom:12px;
                    }
                    .event__heading__name{
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 20px;
                        color: rgba(25, 10, 40, 0.6);
                        text-align:left;
                        margin-bottom:8px;
                    }
                    .yet__header, .upcoming__header{
                        margin-top:28px;
                    }
                    .yet__event__style{
                            border-radius: 8px;
                            background: rgba(25, 10, 40, 0.05);
                            padding:16px;
                            margin-bottom:8px;
                    }
                    .yet__event__name{
                        font-weight: 500;
                        font-size: 16px;
                        line-height: 24px;
                        color: rgba(25, 10, 40, 0.3);
                        text-align:left;
                        margin-bottom:8px;
                    }
                    .yet__subtitle{
                            font-weight: normal;
                            font-size: 14px;
                            line-height: 20px;
                            color: rgba(25, 10, 40, 0.3);
                            text-align:left;
                    }
                    .mobile__event{
                        position:relative;
                        img{
                            max-width: 100%;
                            min-width: 100%;
                            height: 96px;
                        }
                }
                    .img__wrapper{
                        position: absolute;
                        width: 100%;
                    }
                    .desktop__event{
                        display:none;
                    }
                    .event__style{
                        margin-bottom:8px;
                    }
                    .event__info{
                        position:relative;
                        height:96px;
                    }
                    .wrapper__content{
                        padding: 12px 16px;
                    }
                    .event__name{
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 20px;
                        color: #FFFFFF;
                        text-align:left;
                    }
                    .event__date{
                        font-weight: 500;
                        font-size: 10px;
                        line-height: 12px;
                        letter-spacing: 0.1px;
                        text-transform: uppercase;
                        color: rgba(255, 255, 255, 0.6);
                        text-align:left;
                        margin-bottom:8px;
                    }
                    .event__prize{
                        font-weight: bold;
                        font-size: 20px;
                        line-height: 28px;
                        color: #33FF66;
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
                        .yet__subtitle{
                            font-size: 16px;
                            line-height: 20px;
                        }
                       .yet__event__style{
                            border-radius: 16px;
                            padding: 30px 16px;
                            margin-bottom:16px;
                        }
                        .event__heading__name{
                            font-size: 20px;
                            line-height: 32px;
                            margin-bottom:16px;
                            color: #222222;
                        }
                        .yet__header, .upcoming__header{
                            margin-top:32px;
                        }
                        .desktop__event{
                            height:160px;
                            display:block;
                            position: relative;
                            img{
                                max-width: 100%;
                                min-width: 100%;
                                height: 160px;
                            }
                        }
                        .mobile__event{
                            display:none;
                        }
                        .event__info{
                                height:160px;
                        }
                        .event__name{
                            font-size: 20px;
                            line-height: 32px;
                        }
                        .event__date{
                            font-size: 16px;
                            line-height: 24px;
                        }
                        .event__prize{
                            font-size: 48px;
                            line-height: 56px;      
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
                        .yet__event__style{
                            border-radius: 16px;
                            padding: 5  0px 16px;
                            margin-bottom:16px;
                        }
                        .yet__subtitle{
                            font-size: 20px;
                            line-height: 28px;
                        }
                        .event__heading__name{
                            font-size: 24px;
                            line-height: 44px;
                            margin-bottom:16px;
                        }
                        .yet__subtitle{
                            font-size: 16px;
                            line-height: 24px;
                        }
                    }

                            
                `}</style>
            </section>
        );
    }
}

export default EventCalendar;