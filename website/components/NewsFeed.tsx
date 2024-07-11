import React, { Component } from 'react';


const monthsNameArr=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const getMonth =  (date) => monthsNameArr[new Date(date).getMonth()];
const getDay =  (date) => new Date(date).getDate();
const getYear =  (date) => new Date(date).getFullYear();
const  timeSince = (date) => {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = seconds / 31536000;
  
    if (interval >= 1) {
      return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval >= 1) {
      return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval >= 1) {
      return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval >= 1) {
      return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval >= 1) {
      return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

class NewsFeed extends Component {
    constructor(props) {
        super(props);
        this.state={
                news:this.getOrderData(props.newsFeeds),
                showMore: props.newsFeeds.length > 3 ? true : false,
                showNewsCount:  props.newsFeeds.length >3 ? 3 : props.newsFeeds.length
        }
    }
    getOrderData(newsFeeds){
        newsFeeds.sort((a,b) =>  new Date(b.date) - new Date(a.date));
        return newsFeeds;
    }
    
    showMorePosts = () =>{
            if(this.props.newsFeeds.length > this.state.showNewsCount+3 ){
                this.setState({showNewsCount:this.state.showNewsCount+3});
            }
            else{
                this.setState({showNewsCount:this.props.newsFeeds.length,showMore:false});
            }
    }
    
    render() {
        if(!this.state.news)
            return <></>;
        return (
            <section>
            <div className="container">
                <div className="section-layout">
                        {this.props.header && <h2 className="news__feed_heading">{this.props.header}</h2>}
                        {this.props.discription && (
                            this.props.discription.map((disc,key)=><p className="section__discription">{disc}</p>)
                        )}
                        {
                            this.state.news.slice(0,this.state.showNewsCount).map((feed,key) =>(
                            <div className="news__feed" key={key}>
                                {feed.imageUrl && (<div className="image__section">
                                    <img src={feed.imageUrl.png} alt={feed.imageUrl.png.alt}/>
                                </div>)}
                                <div className="info__section">
                                    {feed.title && (<div className="heading__section">
                                        <h4>{feed.title}</h4>
                                    </div>)}
                                    {console.log(feed.date)}
                                    {feed.date && (
                                    <div className="added__date__section">
                                        <div>
                                            <span className="month">{getMonth(feed.date)} </span>
                                            <span className="day">{getDay(feed.date)}, </span>
                                            <span className="year">{getYear(feed.date)}</span>
                                        </div>
                                        <div className="dot">
                                        </div>
                                        <div>
                                            <span className="ago">{timeSince(new Date(feed.date))} AGO</span>
                                        </div>
                                    </div>)}
                                </div>
                            </div>
                            ))
                        }
                        {this.state.showMore && (<h4 className="show__more" onClick={this.showMorePosts}>View More</h4>)}
                </div>
               
            </div>
            <style jsx>{`
                
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
                .news__feed{
                    display: flex;
                    background: #F4F3F4;
                    border-radius: 0px 8px 8px 0px;
                    margin-bottom: 16px;
                    width:100%;
                }

                .image__section{
                    display: flex;
                    img{
                        min-width: 100px;
                        max-width: 100px;
                        height:90px;
                    }
                }
                .info__section{
                    margin: 5px 16px 5px 12px;
                }
                
                .heading__section{
                    display: flex;
                    align-items: center;
                    min-height:60px;
                    h4{
                        font-weight: 500;
                        font-size: 12px;
                        line-height: 16px;
                        color: #190A28;
                        text-align:left;
                        margin:0;

                    }
                }

                .added__date__section{
                    font-style: normal;
                    font-weight: 500;
                    font-size: 10px;
                    line-height: 12px;
                    letter-spacing: 0.1px;
                    text-transform: uppercase;
                    color: rgba(25, 10, 40, 0.6);
                    text-align:left;
                    display: flex;
                    align-items: center;
                }
                .dot{
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background: rgba(25, 10, 40, 0.6);
                    display: inline-block;
                    margin-left: 4px;
                    margin-right: 4px;

                }
                .show__more{
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 20px;
                    text-align: right;
                    color: #E91051;
                    margin:0;
                    margin-right:16px;
                    margin-top:8px;
                    margin-bottom:8px;
                    cursor: pointer;
                }
                .section__discription{
                    font-weight: normal;
                    font-size: 12px;
                    line-height: 16px;
                    color: rgba(25, 10, 40, 0.6);
                    text-align: left;
                    margin:0;
                    margin-bottom:12px;
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

                    .heading__section{
                        min-height:auto;
                        h4{
                            font-size: 16px;
                            line-height: 20px;
                            margin:0;
    
                        }
                    }
                    .added__date__section{
                        font-size: 12px;
                        line-height: 14px;
                        margin-top:24px
                    }
                    .info__section{
                        margin:16px;
                    }

                    .image__section{
                        img{
                            min-width: 120px;
                            max-width: 120px;
                            height:120px;
                        }
                    }
                    .news__feed{
                        margin-bottom: 20px;
                        border-radius: 16px;
                    }

                    .show__more{
                        font-size: 16px;
                        line-height: 20px;
                    }
                    .section-layout {
                        padding:24px;
                    }
                    .section__discription{
                        font-size: 14px;
                        line-height: 18px;
                        text-align:center;
                        
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

                    .heading__section{
                        min-height:auto;
                        h4{
                            font-weight: 500;
                            font-size: 20px;
                            line-height: 28px;
                            margin:0;
    
                        }
                    }
                    .added__date__section{
                        font-weight: 500;
                        font-size: 16px;
                        line-height: 20px;
                    }
                    .info__section{
                        margin:32px 24px;
                    }

                    .image__section{
                        img{
                            min-width: 244px;
                            max-width: 244px;
                            height:160px;
                        }
                    }
                    .news__feed{
                        margin-bottom: 24px;
                        border-radius: 16px;
                    }

                    .show__more{
                        font-size: 20px;
                        line-height: 28px;
                    }

                    .section-layout {
                        padding: 56px 24px;
                    }

                    .section__discription{
                        font-size: 17px;
                        line-height: 24px;
                        margin-bottom:24px;
                    }
                    
                }

                        
            `}</style>
            </section>
        );
    }
}

export default NewsFeed;