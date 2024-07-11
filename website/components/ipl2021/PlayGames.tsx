import React, { Component } from 'react';
import {getHTML, lazyImage} from "../../configs/util";

class PlayGames extends Component {
    constructor(props) {
        super(props);
        this.state = { showIds:[]};
    }

    show = id => {
        
        this.setState(prevState => ({
            showIds: [...prevState.showIds,id]
          }));
    };
    hide = id =>{
        const arr = [...this.state.showIds];
        const index =arr.indexOf(parseInt(id)); 
        arr.splice(index,1);
        this.setState({
            showIds: [...arr]
        });
    }
    componentDidMount(){
        lazyImage();
    }
    render() {
        return (
            <section>
                <div className="container">
                    <div className={this.props.cssClassList}>
                        <div className="all__games">
                            {this.props.content && this.props.content.map((columnContent ,row)=>(
                                <a key={row}>
                                    {columnContent.columnList && columnContent.columnList.map((game,col)=>(
                                    
                                        <div key={col} className="game__area">
                                             {game.imgUrl && (<img 
                                                className="lazy-image img__css" 
                                                data-src={game.imgUrl.png}
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                                                alt={game.imgUrl.alt}
                                                height="80"
                                                width="80"
                                            />)}
                                            <div className="game__info">
                                                {game.gameName && <h4 className="trim-SemiBold semi--bold--text ">{game.gameName}</h4>}
                                                {this.state.showIds.includes((row*this.props.columnListLength+col)) ? (
                                                    <div className="text--area">
                                                        {game.gameInfo && game.gameInfo.map( (text,key)=> <p key={key} className="regular--text trim-Regular m-0 para--css ">{getHTML(text)}</p>)}
                                                        {game.link && <a className="regular--text trim-Regula m-0  game__link" href={game.link}>Know More</a>}
                                                        <p className="regular--text trim-Regular m-0 link__less " onClick={()=>this.hide((row*this.props.columnListLength+col))}>Less</p>
                                                    </div>
                                                ):(
                                                    <div className="text--area">
                                                        <p className="regular--text trim-Regular m-0 para--css ">
                                                            {getHTML(game.gameInfo[0].substring(0, this.props.showChar - 1))}
                                                            <span className="regular--text trim-Regular m-0 link " onClick={()=>this.show((row*this.props.columnListLength+col))}>....More</span>
                                                        </p>
                                                        
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <style jsx>{`
                   
                   
                    h4,p{
                        margin:0;
                    }
                    .game__info a{
                        cursor: pointer;
                        color: #ff0000;
                    }
                    .link,.link__less{
                        color:red;
                        cursor: pointer;
                    }
                    .container{
                        margin-top:8px;
                        margin-right: 0;
                    }
                    .link__less{
                        margin-top: 8px;
                    }
                    .img__css{
                       // width:80px;
                        height:80px;
                        border-radius:16px;
                        max-width:100%;
                    }
                    .para--css{
                        padding-bottom:12px;
                        color: rgba(25, 10, 40, 0.6);
                    }
                    .text--area{
                        margin-bottom:-12px;
                        margin-top:4px;
                    }
                    .semi--bold--text{
                        color: rgba(25, 10, 40, 0.6);
                    }
                    .game__info{
                        margin-left: 16px;
                        text-align: left;
                    }
                    .game__area{
                        display:flex;
                        margin-top: 24px;
                        margin-right: 16px;
                        width:313px;
                    }
                    .all__games{
                        flex-wrap: nowrap;
                        overflow-x: auto;
                        justify-content: unset;
                        scroll-behavior: smooth;
                        display:flex;
                    }
                    .game__link{
                        margin-top:-8px;
                        background: #FFFFFF;
                        border: 1px solid rgba(25, 10, 40, 0.15);
                        border-radius: 4px;
                        padding: 4px 8px;
                        margin-bottom:8px;
                        display: block;
                        width: fit-content;
                    }
                    @media screen and (min-width: 1224px) {
                        .img__css{
                            width:120px;
                            height:120px;
                            border-radius:8px;
                        }
                        .game__area{
                            display:flex;
                            margin-top: 40px;
                            width:480px;
                        }
                        .container{
                            margin-top:24px;
                            margin-right:auto;
                        }
                    }

                    .all__games::-webkit-scrollbar{
                        display: none;
                      }

                `}</style>
            </section>
        );
    }
}

export default PlayGames;