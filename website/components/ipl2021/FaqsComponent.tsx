import React, { Component } from 'react';
import {getHTML} from "../../configs/util";


const Content = (props)=>(
    <div className="content__wrapper">
        
        {props.description && props.description.map((con,key)=>(
            <p className="regular--text trim-Regular m-0 para--css" key={key}>{getHTML(con)}</p>
        ))}
         {props.pointdescription && props.pointdescription.map((con,key)=>(
             <div className="point--section">
                 <p className="m-0 dot">&#9679;</p>
                <p className="regular--text trim-Regular m-0 point--css" key={key}>{getHTML(con)}</p>
            </div>
            
        ))}
        <style jsx>{`
            .para--css{
                margin-bottom:12px;
                color: rgba(25, 10, 40, 0.6);
                text-align:left;
            }
            .point--css{
                margin-bottom:4px;
                color: rgba(25, 10, 40, 0.6);
            }
            .point--section{
                display: flex;
                align-items: flex-start;
                margin-bottom:16px;
            }
            .dot{
                font-size: 6px;
                color: rgba(25, 10, 40, 0.6);
                margin-right: 6px;
                margin-top: 4px;
            }
            .content__wrapper{
                margin-top:4px;
                margin-bottom:-12px
            }
            @media screen and (min-width: 1224px) {
                .para--css{
                    margin-bottom:24px;
                    color: rgba(25, 10, 40, 0.6);
                }
                .content__wrapper{
                    margin-top:8px;
                    margin-bottom:-24px
                }
              }
        `}</style>
        <style>
            {`
            .red-icon-list {
                list-style-image: url('/static/2x/red-icon-list.svg');
            }
            .red-icon-list li {
                font-size: 12px;
                line-height: 18px;
                color: rgba(25, 10, 40, 0.6);
                text-transform: none;

            }
            .faqs-list li{
                font-size: 12px;
                line-height: 16px;
            }

            @media screen and (min-width: 1224px)
            {
                .red-icon-list li {
                    font-size: 20px;
                    line-height: 24px;
                    margin-bottom:20px;
                }

                .faqs-list li{
                    font-size: 20px;
                    line-height: 24px;
                }

            }
            `}
        </style>
    </div>
)

class FaqsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = { ids: [] };
      }
      showParagraph = (id) => {
        this.setState((prevState) => ({
          ids: [...prevState.ids, id],
        }));
      };
      hideParagraph = (id) => {
        const arr = [...this.state.ids];
        const index = arr.indexOf(parseInt(id));
        arr.splice(index, 1);
        this.setState({
          ids: [...arr],
        });
      };

    whichToCall(key,val){
        if(val===false)
            this.showParagraph(key);
        else
            this.hideParagraph(key);
    }  

    render() {
        return (
            <section>
                <div className="container">
                    <div className={`${this.props.cssClassList ? this.props.cssClassList.join(" ") : ""}`}>
                        {this.props.content && this.props.content.map((faq,key)=>(
                            <div className="faq__block" key={key} style={{marginBottom:(this.props.content.length-1)===key ?"0px":undefined}}>
                                <div className="header__block" onClick={()=>this.whichToCall(key,this.state.ids.includes(key))}>
                                    <h4 className="ternary--header m-0 text-align-left trim-Regular">{faq.name}</h4>
                                    <div>
                                        <div className={`arrow ${this.state.ids.includes(key) ? "up":"down"}`}></div>
                                    </div>
                                </div>
                                {this.state.ids.includes(key) ?<Content {...faq}></Content> : <div style={{display:'none'}}><Content {...faq}></Content></div> }
                            </div>
                        ))}
                    </div>
                </div>
                <style jsx>{`
                    .arrow {
                        display: inline-block;
                        width: 7px;
                        height: 7px;
                        border-top: 2px solid rgba(25, 10, 40, 0.6);
                        border-left: 2px solid rgba(25, 10, 40, 0.6);
                        transition: all 250ms ease-in-out;
                        color: transparent;
                        margin-left:12px;
                      }
                      .arrow.up {
                        transform: rotate(45deg);
                      }
                      
                      .arrow.down {
                        transform: rotate(-135deg);
                      }
                      .faq__block{
                        background: #F4F3F4;
                        border-radius: 8px;
                        margin-bottom: 8px;
                        padding:12px;
                        cursor:pointer;
                      }
                      .header__block{
                        color: #230046;
                        display:flex;
                        justify-content:space-between;
                        align-items: flex-start;
                      }
                      @media screen and (min-width: 1224px) {
                        .desktop--padding-24{
                            padding:0 24px;
                        }
                        .faq__block{
                            margin-bottom: 12px;
                            padding:20px 24px;
                          }
                      }
                      
                `}</style>
            </section>
        );
    }
}

export default FaqsComponent;