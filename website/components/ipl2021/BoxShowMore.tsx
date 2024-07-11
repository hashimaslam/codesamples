import React, { Component } from 'react';
import {TextualContent,WithListContent,HorizontalImg,VerticalImg,TabluarTwoColComponent,BoxUlRow,BoxRow} from "./ContentComponents";

const factoryComponetsText = {
    TextualContent:TextualContent,
    WithListContent:WithListContent,
    HorizontalImg : HorizontalImg,
    VerticalImg:VerticalImg,
    TabluarTwoColComponent:TabluarTwoColComponent,
    BoxUlRow:BoxUlRow,
    BoxRow:BoxRow
  };

const componentLookUp = (data, key) => {
    const Component = factoryComponetsText[data.name];
    if(!Component)
        return<></>;
    return <Component {...data.data} key={key} />;
};

  class BoxShowMore extends Component {
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
                    <div className={this.props.cssClassList} >
                        <div className="" onClick={this.toggleParagraph}>
                            <div className="show--bar">
                                    <h4 className="m-0 heading--css trim-Regular">{this.props.header}</h4>
                                    <div className={`arrow down`}></div>
                            </div>
                        </div>

                       <div>
                                {this.props.componentsShowMore && this.props.componentsShowMore.map((comp,key)=>(
                                    componentLookUp(comp,key)
                                ))}
                        </div>
                          <div>
                                    {this.props.components && this.props.components.map((comp,key)=>(
                                        componentLookUp(comp,key)
                                    ))}
                        </div>                
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
                        font-weight: 400;
                    }
                    .icon__style{
                        width:10px;
                        height:14px;
                    }
                    .img__css{
                        margin: auto;
                        display: block;
                        margin-top:12px;
                        height:160px;
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
                            width:800px;
                            height:408px;

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

export default BoxShowMore;