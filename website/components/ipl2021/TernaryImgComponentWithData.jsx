import React, { Component } from 'react';
import { getHTML } from "../../configs/util";

class TernaryImgComponentWithData extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false ,text:"More"};
      }
      toggleParagraph = () => {
          let text="More";
        if(!this.state.show)
            text="Less"
        this.setState({
            show:!this.state.show,
            text
        });
      };
      
    render() {
        return (
            <section style={this.props.backgroundCss}>
                <div className="container">
                    <div className={`${this.props.cssClassList ? this.props.cssClassList.join(" ") : ""}`} >
                        <div className="" onClick={this.toggleParagraph}>
                            <div className="show--bar">
                                    <h4 className="m-0 heading--css trim-Regular">{this.props.header}</h4>
                                    <div className={`arrow ${this.state.show ? "up":"down"}`}></div>
                            </div>
                           {this.props.imgUrl && 
                        //    <img className="img__css" src={this.props.imgUrl.png} alt={this.props.imgUrl.alt}  loading="lazy"
                        //    />
                           
                           <picture>
                           <source srcSet={this.props.imgUrl.webp} type="image/webp" />
                           <source srcSet={this.props.imgUrl.png} type="image/png" />
               
                           <img
                             className="img__css"
                             src={this.props.imgUrl.png}
                             alt={this.props.imgUrl.alt}
                             loading="lazy"
                           />
                         </picture>
                           
                           
                           }
                        </div>

                         {(this.state.show) &&(<div className="content">
                             {this.props.paragraph && <p className="regular--text trim-Regular para--color">{getHTML(this.props.paragraph)}</p>}
                             {this.props.instructions && this.props.instructions.map((instr,key)=>(
                                 <p className="regular--text trim-Regular m-0 para--css" > 
                                 {instr[0]==="#" ? <b>{instr.substring(1)}</b>: instr}
                                 </p>
                             ))}
                            {this.props.description && this.props.description.map((con,key)=>(
                                <div className="row__data">
                                    <div className="icon--css">
                                        <svg className="icon__style" width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.1004 0.199997L0.400391 5.79999L0.850397 6.20004H4.00041V9.8H4.90043L7.60039 4.24437L7.26756 3.80001H4.00041V0.199997H3.1004Z" fill="#E91051"/>
                                        </svg>
                                    </div>
                                    <p className="regular--text trim-Regular m-0 para--css">
                                        <b className="text--title">{con.substring(0, con.indexOf(":")+1)}</b>
                                        {con.substring(con.indexOf(":")+1)}
                                    </p>
                                </div>
                            ))}
                            {this.props.tablularContent && this.props.tablularContent.map((con,key) => (
                              <div className="tabular-row">
                             <div className="text" style={con.textStyles && con.textStyles}>{con.text}</div>
                            <div className="numbers" style={con.styleNumbers}>{con.numbers}</div>
                           </div>

                            ))}
                        </div>)}
                        
                    </div>
                </div>
                <style jsx>{`


                    .grey_background-mobile{
                        background: #F4F3F4;
                        border-radius: 8px;
                        padding:12px;
                    }
                    .margin__bottom--comp{
                        margin-bottom:16px;
                    }
                    .para--css{
                        color: rgba(25, 10, 40, 0.6);
                        margin-left:8px;
                    }
                    .para--color{
                        color: rgba(25, 10, 40, 0.6);
                    }
                    .heading--css{
                        font-size: 14px;
                        line-height: 20px;
                        color: #230046;
                    }
                    .row__data{
                        display:flex;
                        margin-bottom:16px;
                    }

                    .content{
                        margin-top:12px;
                        margin-bottom:-16px;
                    }
                    .text--title{
                        color: #190A28;
                    }
                    .icon__style{
                        width:10px;
                        height:14px;
                    }
                    .img__css{
                        margin: auto;
                        display: block;
                        margin-top:12px;
                        height:auto;
                    }
                    .icon--css{
                        width:10px;
                    }
                    .show--bar{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor:pointer;
                    }
                    .arrow {
                        display: inline-block;
                        min-width: 7px;
                        min-height: 7px;
                        border-top: 2px solid rgba(25, 10, 40, 0.6);
                        border-left: 2px solid rgba(25, 10, 40, 0.6);
                        transition: all 250ms ease-in-out;
                        color: transparent;
                        margin-left:20px;
                      }
                      .arrow.up {
                        transform: rotate(45deg);
                        margin-top: 4px;
                      }
                      
                      .arrow.down {
                        transform: rotate(-135deg);
                        margin-top: -2px;
                      }
                      .baseball__page{
                        .img__css{
                            margin: auto;
                            display: block;
                            margin-top:12px;
                            width:244px;
                            height:auto;
                        }
                      }
                      .tabular-row{
                        padding: 16px 8px;
                        justify-content: space-between;
                          display:flex;
                          .text,.numbers{
                            font-family: Trim-Regular;
                            font-size: 12px;
                            line-height: 16px;
                            color: rgba(25, 10, 40, 0.6);
                            padding-right:16px;
                          }
                          .numbers {
                              color:#19BE00;
                              padding-right:0;
                          }
                      }

                      .paragraph{
                        font-family: Trim-Regular;
                        font-size: 12px;
                        line-height: 16px;
                        color: rgba(25, 10, 40, 0.6);
                      }
                      @media screen and (min-width: 1224px) {
                        .heading--css{
                            font-size: 24px;
                            line-height: 32px;
                        }
                        .grey_background-mobile{
                            border: 1px solid #E6E6E6;
                            padding:24px;
                            background: #FFFFFF;
                        }
                        .img__css{
                            margin-top:50px;
                            width:auto;
                            height:auto;

                        }
                        .arrow {
                            min-width: 12px;
                            min-height: 12px;
                            border-top: 2px solid #190A28;
                            border-left: 2px solid #190A28;
                            margin-left:20px;
                        }
                        .margin__bottom--comp{
                            margin-bottom:64px;
                        }
                        .icon__style{
                            width:13px;
                            height:17px;
                        }
                        .baseball__page{
                            .img__css{
                                margin: auto;
                                display: block;
                                margin-top:12px;
                                width:360px;
                                height:524px;
                            }
                          }

                          .tabular-row{
                            padding: 16px;
                            justify-content: space-between;
                              display:flex;
                              .text,.numbers{
                                font-family: Trim-Regular;
                                font-size: 20px;
                               line-height: 24px;
                                
                              }
                              .numbers {
                                  color:#19BE00;
                              }
                          }

                          .tabular-row:nth-of-type(odd) {
                            background: #F4F3F4;
                          }

                          .paragraph{
                            font-size: 20px;
                            line-height: 24px;
                          }
                      }
                      
                `}</style>
            </section>
        );
    }
}

export default TernaryImgComponentWithData;