import link from 'next/link';
import React, { Component } from 'react';


const GameType = (props) =>{
 
   const linkClicked = (linkname) => {
       if(window.location.pathname === "/esports/arena" || window.location.pathname === "/esports/dailyseries"){
        window.dataLayer = window.dataLayer || []; 
        window.dataLayer.push({
          event: 'GameSelected',
          ButtonName:linkname,
          LocationOfAction:"Hamburger_menu",
          Game:linkname
        });
      }
    }

    return(
    <div className={"games--section "+props.cssClasses}>
        <div className="title--area">
            <img src={props.list?.gameTypeIcon?.png} alt={props.list?.gameTypeIcon?.alt} className="icon--css"/>
            <h4 className="trim-Medium game--type--name">{props.list?.gameTypeName ?? "Games"}</h4>
        </div>
        {props.list?.games.map((link,pageKey)=>(
            <a className="page--link" href={link.link} key={pageKey} onClick={()=>linkClicked(link.name)}>
                <p className=" trim-Regular link-css">{link.name}</p>
            </a>
        ))}
        <style jsx>{`
            .games--section{
                width:230px;
                margin-bottom:-16px;
                padding-bottom:64px;
            }
            .title--area{
                display: flex;
                align-items: center;
                margin-bottom:12px;
            }
            .game--type--name{
                margin:0;
                font-size: 20px;
                line-height: 24px;
                color: #230046;
            }
            .icon--css{
                width:44px;
                height:44px;
                margin-right:14px;
            }
            .link-css{
                margin:0;
                font-size: 20px;
                line-height: 24px;
                color: #230046;
                text-align: left;
            }
            .page--link{
                margin-left:58px;
                padding-bottom:16px;
                display: block;
            }
            .old--page{

                .game--type--name{
                    font-family: 'Roboto';
                    font-weight: 500;
                }
                .link-css{
                    font-family: 'Roboto';
                    font-weight: 400;
                }
            }
        `}</style>
    </div>
    )
}

class DesktopHeader extends Component {

    render() {
        return (
            <div className="header--menu">
                    {this.props.menuList && this.props.menuList.map((list,key) =>(
                        <div className="vertical--list" key={key}>
                            {list && list.map((gamesType,key1)=>(
                                <div className="gameType" key={key1}>
                                    {<GameType list={gamesType} cssClasses={this.props.cssClasses}/>}
                                </div>
                            ))}
                        
                        </div>
                    ))}
                <style jsx>{`
                    .header--menu{
                        margin: 0 117px;
                        display: flex;
                        justify-content: space-between;
                    }
                    .vertical--list{
                        margin-top:32px;
                    }
                    p{
                        margin:0;
                    }
                `}</style>
            </div>
           
        );
    }
}

export default DesktopHeader;