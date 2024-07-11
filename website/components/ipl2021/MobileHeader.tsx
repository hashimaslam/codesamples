import React, { Component } from 'react';
import {getHTML ,lazyImage} from "../../configs/util";

const GameLinks =(props) =>{
    const linkClicked = (linkname) => {
        if(window.location.pathname === "/esports/arena" ||  window.location.pathname === "/esports/dailyseries"){
         window.dataLayer = window.dataLayer || []; 
         window.dataLayer.push({
           event: 'GameSelected',
           ButtonName:linkname,
           LocationOfAction:'hamburger_menu',
           Game:linkname
         });
       }
     }
    return(
    <div className={"page--links"+ " "+props.cssClasses}>
        {props.gameLinks && props.gameLinks.map((link,pageKey)=>(
             <a className="page-link" href={link.link} key={pageKey} onClick={()=>linkClicked(link.text)}>
                <img 
                className="page--img lazy-image" 
                src={link.imgUrl?.png} 
                alt={link.imgUrl?.alt}
                />
                <p className=" trim-Regular link-css">{link.text}</p>
            </a>
        ))}
        <style jsx>{`
            .page-link{
                width:88px;
                margin: 0 8px;
                margin-top:24px;
                display: block;
            }
            .page--img{
                width: 88px;
                height: 88px;
                border-radius: 12px;
            }
            .link-css{
                margin:0;
                margin-top:8px;
                font-size: 16px;
                line-height: 22px;
                color: #190A28;
            }
            .page--links{
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                padding-left: 32px;
            }
            .old--page{
                .link-css{
                    font-family: 'Roboto';
                    font-weight: 400;
                }

            }
        `}</style>
    </div>
    )
}

class MobileHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
          showIds:[]
        };
    }
    toggleCategory = (id,name) =>{
        
        if(this.state.showIds.includes(id)){
            const arr = [...this.state.showIds];
            const index =arr.indexOf(parseInt(id)); 
            arr.splice(index,1);
            this.setState({
                showIds: [...arr]
              });
        }
        else{
            this.setState(prevState => ({
                showIds: [...prevState.showIds,id]
              }));
              if(window.location.pathname === "/esports/arena" || window.location.pathname === "/esports/dailyseries"){
                window.dataLayer = window.dataLayer || []; 
                window.dataLayer.push({
                  event: `GameSelected`,
                  ButtonName:name,
                  LocationOfAction:"hamburger_menu",
                  Game:name
                });
              }
        }
      

    }

     linkClicked = (linkname) => {
        if(window.location.pathname === "/esports/arena" ||  window.location.pathname === "/esports/dailyseries"){
         window.dataLayer = window.dataLayer || []; 
         window.dataLayer.push({
           event: linkname +"_clicked",
           ButtonName:linkname,
           LocationOfAction:"Hamburger_menu",
           Game:''
         });
       }
     }

    componentDidMount() {
        lazyImage();
      }
    render() {
        return (
            <div className={"header--menu "+this.props.cssClasses}>
                {this.props.menuList && this.props.menuList.map((category,key)=>(
                    <div key={key} className="links--area">
                        {category.expandable && <div className="expandable--area">
                            <div className={"category--area "+category.cssClassList} onClick={()=>this.toggleCategory(key,category.gameType)}>
                                <div className="img--name">
                                    {category.imgUrl &&<img 
                                            data-src={category.imgUrl?.png} 
                                            alt={category.imgUrl?.alt} 
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                                            className="category--img lazy-image"
                                            />}
                                    {category.gameType && <p className="trim-Medium category--name">{category.gameType}</p>}
                                </div>
                                <div className="plus--minus">
                                    <div className="plus"></div>
                                    <div className={this.state.showIds.includes(key) ? "hide--minus":"minus"}></div>
                                </div>
                            </div>
                            {this.state.showIds.includes(key) && <GameLinks gameLinks={category.games} cssClasses={this.props.cssClasses}/>}
                        </div>}
                      
                        {/* {!category.expandable && <a className={"just--link "+category.cssClassList} href={category.link} onClick={()=> this.linkClicked(category.gameType)}>
                       */}
                        {!category.expandable && <a className={"just--link "+category.cssClassList} href={category.link} onClick={()=> this.linkClicked(category.gameType)}>
                      
                            {category.imgUrl &&<img 
                                            data-src={category.imgUrl?.png} 
                                            alt={category.imgUrl?.alt}
                                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                                            className="category--img  lazy-image"
                                             />}
                            {category.gameType && <p className="trim-Medium category--name">{category.gameType}</p>}
                            {category.newGame &&<p className="trim-Regular new--url">NEW</p>}
                        </a>}
                    </div>
                ))}
                
                <style jsx>{`
                    .header--menu{
                        padding: 0 24px;
                    }
                    p{
                        margin:0;
                    }
                    .links--area{
                        margin-top:16px;
                    }
                    .category--area{
                        display:flex;
                        justify-content: space-between;
                    }
                    .img--name{
                        display: flex;
                        align-items: center;
                        height: 48px;
                    }
                    .category--img{
                        width:40px;
                        height:40px;
                    }
                    .category--name{
                        font-size: 18px;
                        line-height: 22px;
                        color: #230046;
                        margin-left:12px;
                    }
                    .plus--minus{
                        position:relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 40px;
                    }
                    .plus,.minus {
                        background: #230046;
                        width: 12px;
                        height: 2px;
                        display: block;
                        position: absolute;
                        text-align: center;
                        box-sizing: border-box;
                      
                    }
                    .minus{
                        transform: rotate(-90deg);
                    }
                    .hide--minus{
                        transform: rotate(0deg);
                    }

                    .just--link{
                        display: flex;
                        height: 48px;
                        align-items: center;
                    }
                    .new--url{
                        color: #A15810;
                        font-size:7px;
                        line-height:15px;
                        background: #FFF200;
                        padding: 0 4px;
                        margin-left:12px;
                        border-radius: 2px;
                    }
                    .red-color .category--name{
                        color: #FF1E46;
                    }
                    .old--page{
                       
                        .category--name{
                            font-family: 'Roboto';
                            font-weight: 500;
                        }
                    }
                `}</style>
            </div>
           
        );
    }
}

export default MobileHeader;