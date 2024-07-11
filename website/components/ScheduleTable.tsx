import React, { Component } from 'react';
import {getHTML} from "../configs/util";

const PointsSystem = ({ matchTypeData,linkClicked}) =>{

    
    if(!matchTypeData)
        return "";
        return matchTypeData.map((data ,key)=>(
            <div className="points-rectangle" key={key}>
                <div>
                    <div className="showBarItem">
                        <div className="wrapperImgHeader">
                                <img 
                                    className="game-img"
                                    src={data.imageurl.png} 
                                    alt={data.title} 
                                />
                                <div className="title--date--wrpper">
                                    <h3 className="schedule-title">{data.title}</h3>
                                    <h4 className="schedule-date">{data.date}</h4>
                                </div>
                        </div>
                       
                    </div>
                </div>
                {data.liveStream &&(<div className="live--stream">
                        <hr></hr>
                        <h4 className="live--stream--text">{data.liveStream.text}</h4>
                        <div className="straimg--channels">
                                <div className="stream-box">
                                    <a href={data.liveStream.ytLink} onClick={()=>linkClicked('youtube')} className="channel__link">
                                      {data.liveStream.youtubeImageUrl &&(<img 
                                                className="stream-img"
                                                src={data.liveStream.youtubeImageUrl.png} 
                                                alt={data.liveStream.text} 
                                            />)}
                                        </a>
                                </div>
                               
                                 <div className="stream-box stream--margin--left">
                                    <a href={data.liveStream.fbLink} className="channel__link" onClick={()=>linkClicked('facebook')} >
                                        { data.liveStream.facebookImageUrl &&(<img 
                                                className="stream-img"
                                                src={data.liveStream.facebookImageUrl.png} 
                                                alt={data.liveStream.text} 
                                            />
                                        )}
                                    </a>
                                 </div>
                               
                        </div>
                </div>)}
                <style jsx>{`
                h3,h4{
                    margin:0;
                    text-align: left;
                }
                .points-rectangle {
                    padding: 12px;
                    background: #F4F3F4;
                    border-radius: 4px;
                    margin: 8px 0;
                }
                .showBarItem {
                    display: flex;
                }
                .game-img {
                    border-radius: 4px;
                    height: 32px;
                    width: 32px;
                }
                .wrapperImgHeader {
                    display: flex;
                    align-items: center;
                   
                }
                .schedule-title{
                    font-style: normal;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 16px;
                    color: rgba(0, 0, 0, 0.8);
                    margin-bottom: 4px;
                }
                .schedule-date{
                    font-style: normal;
                    font-weight: normal;
                    font-size: 12px;
                    line-height: 16px;
                    color: rgba(0, 0, 0, 0.5);
                    
                }
                .title--date--wrpper{
                    margin-left:12px;
                }
                .live--stream{
                    margin-top:16px;
                }
                .live--stream--text{
                    margin-top: 12px;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 10px;
                    line-height: 12px;
                    letter-spacing: 0.1px;
                    color: rgba(0, 0, 0, 0.8);
                }
                .straimg--channels{
                    margin-top: 12px;
                    display:flex;
                }
                .stream-img{
                    width:65px;
                    height:15px;
                }
                .stream-box{
                    padding: 8px 12px;
                    border: 1px solid #867E8E;
                    box-sizing: border-box;
                    border-radius: 4px;
                }
                .stream--margin--left{
                    margin-left:14px;
                }

                `}</style>
            </div>
        ))
        
}
class ScheduleTable extends Component {
    constructor () {
        super();
        this.state = { buttonId:0};
    }

    linkClicked = (linkname) => {
        if(window.location.pathname === "/esports/arena" || window.location.pathname === "/esports/dailyseries"){
         window.dataLayer = window.dataLayer || []; 
         window.dataLayer.push({
           event: 'socialLinksClicked',
           ButtonName:linkname,
           LocationOfAction:"body",
           Game:''
         });
       }
     }
  
    showTable = (id,name) =>{
       
        this.setState({buttonId:id});

        if(window.location.pathname === "/esports/arena" || window.location.pathname === "/esports/dailyseries"){
            window.dataLayer = window.dataLayer || []; 
            window.dataLayer.push({
              event: `${name}_League`,
              ButtonName:'',
              LocationOfAction:"body",
              Game:name
            });
          }
    }
    
    render() {
        const { schedules,scheduleSystem } = this.props;
        return (
          <section> 
            <div className="container">
              <div className="section-layout">
                    <h2 className="section-header section-header--medium schedule--header">{this.props.header}</h2>
                        <div className="button-wrapper">
                            {schedules
                            ? schedules.map((schedule, index) => (
                                <div  key={index}>
                                    <div
                                        className={
                                        this.state.buttonId == index
                                            ? "button button-red"
                                            : "button button-white"
                                        }
                                        onClick={() => this.showTable(index,schedule.name)}
                                    >
                                        {schedule.name}
                                    
                                    </div>
                                    <h3 className={ `button__date ${this.state.buttonId == index
                                            ? "button__date--active"
                                            : "button__date--not--active"}`}>{schedule.date}</h3>
                                </div>
                                ))
                            : ""}
                        </div>

                    <div className="schedule--data">
                        <PointsSystem
                        matchTypeData={
                            scheduleSystem
                            ? scheduleSystem[this.state.buttonId]
                            : ""
                        }
                        linkClicked = {this.linkClicked}
                        />
                    </div>
                </div>
            </div>
            
            <style jsx>{`
            .button__date{
               font-size: 10px;
                line-height: 12px;
                text-align: center;
                letter-spacing: 0.1px;
                
            }
            .button__date--active{
                color: rgba(25, 10, 40, 0.6);
            }
            .button__date--not--active{
                color: rgba(25, 10, 40, 0.3);
            }
            .button--white{
                color: rgba(25, 10, 40, 0.3);
            }
            .point-table-background {
                background: #fff;
                margin: 0px 8px;
            }
            section{
                background: #fff;
                margin: 0 8px;
                margin-bottom: -1px;

            }
            .button{
                padding: 7px 0;
                border-radius: 4px;
                cursor: pointer;
                min-width: 72px;
                max-width: calc(calc(100%-24) / 4);
                font-size: 14px;
                line-height: 20px;
            }
            .button-red {
                background: #ff1e46;
                color: #ffffff;
                font-weight: 500;
              
            }
            .button-white {
                background: #ffffff;
                border: 1px solid #e6e6e6;
                color:rgba(25, 10, 40, 0.3);
                font-weight: normal;
                
            }
            .button-wrapper {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .section-layout{
                padding:24px 16px;
            }
            .schedule--header{
                font-size: 20px;
                line-height: 28px;
                margin-bottom: 16px;
                color: #190A28;
            }
            .schedule--data{
                margin-top: 24px;
            }
            @media screen and (min-width: 768px) {
                .section-layout {
                    width: 500px;
                    margin: auto;
                 }
                 .schedule--header{
                    font-size: 28px;
                    line-height: 36px;
                    margin-bottom: 16px;
                    color: #190A28;
                }
             }
             @media screen and (min-width: 1224px) {
                 .schedule--header{
                    font-size: 28px;
                    line-height: 36px;
                    margin-bottom: 16px;
                    color: #190A28;
                }
             }

        `}</style>

          </section>
        );
    }
}

export default ScheduleTable;