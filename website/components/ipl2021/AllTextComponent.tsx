import React, { Component } from 'react';
import {getHTML} from "../../configs/util";
import {TextualContent,H4Content,WithListContent,VerticalImg,HorizontalImg,TabluarTwoColComponent} from "./ContentComponents";
import { H4header } from './H4header';

const BoldContent =(props) =>(
    <div className={props.cssClassList+" wrapper__css"}>

        { props.description && props.description.map((row,key)=>(
                <p className="regular--text trim-Regular m-0 para--css" key={key}>
                    <b className="trim-Bold">{getHTML(row)}</b>
                </p>
        ))}
        <style jsx>{`
            
        `}</style>
    </div>
)

const TernaryHeader =(props) =>(
    <div className={props.cssClassList}>
        {props.text && <p className={props.headerCss? props.headerCss: "trim-Regular m-0 subheader--medium"}>
            {props.text}
        </p>}
        <style jsx>{`
            .m-4{
                margin:0;
                margin-bottom:4px;
            }
            .m-subheader
            {
                margin:0;
                margin-bottom:12px;
            }
            p{
                margin:0;
            }
            .ternary--header{
                font-weight: 600;
                font-size: 16px;
                line-height: 22px;
                color: #230046;
            }
            @media screen and (min-width: 1224px) {
                .m-4{
                    margin-bottom:16px;
                }
                .m-subheader{
                    margin-bottom:16px;
                }
            }
        `}</style>
    </div>
)


export const StepsComponent = (props)=>(
    <div className={props.cssClassList+" steps--section"}>
        {props.steps && props.steps.map((step,key)=>(
            <div key={key} className="step--section">
                <div>
                    <div className="text--area">
                        <p className="title">{step.title}</p>
                        {step.info && <p className="regular--text info text-align-left">{step.info}</p>}
                    </div>
                    <picture>
                        <source srcSet={step.imgUrl.webp} type="image/webp" />
                        <source srcSet={step.imgUrl.png} type="image/png" />
                        <img
                        src={step.imgUrl.png}
                        alt={step.imgUrl.alt}
                        loading="lazy"
                        className="img--css"
                        />
                    </picture>
                </div>
            </div>
        ))}
    <style jsx>{`
        .img--css{
            width: 315px;
            height: 149px;
            border-radius: 8px;
        }
        .steps--section{
            padding:0 32px;
            margin-bottom:-24px;
        }
        p{
            margin:0;
        }
        .title{
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: #230046;
            margin-bottom:4px;
        }
        .step--section{
            padding-bottom:24px;
        }
        .info{
            color: rgba(25, 10, 40, 0.6);
        }
        .text--area{
            margin-bottom:16px;
        }
        @media screen and (max-width: 411px) {
            .img--css{
                    width:100%;
            }
        }

        @media screen and (min-width: 1224px) {
            .step--section{
                display: flex;
                justify-content: center;
            }
            .text--area{
                margin-bottom:32px;
                width: 800px;
            }
            .title{
                font-size: 24px;
                line-height: 32px;
                margin-bottom:8px;
               
            } 
            .img--css{
                width: 800px;
                height: 408px;
            }
            
        }

    `}</style>
    </div>
)

const factoryComponetsText = {
    H4Content:H4Content,
    BoldContent: BoldContent,
    TextualContent:TextualContent,
    WithListContent:WithListContent,
    TernaryHeader:TernaryHeader,
    HorizontalImg : HorizontalImg,
    VerticalImg : VerticalImg,
    StepsComponent:StepsComponent,
    TabluarTwoColComponent:TabluarTwoColComponent
  };
  
  const componentLookUp = (data, key) => {
    const Component = factoryComponetsText[data.name];
    if(!Component)
        return<></>;
    return <Component {...data.data} key={key} />;
  };

class AllTextComponent extends Component {
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
            <section className={this.props.backgroundCss}>
                <div className="container">
                    <div className={this.props.cssClassList} >
                        {/* {(this.props.showMore && !this.state.show) &&(<div>
                                {this.props.componentsShowMore && this.props.componentsShowMore.map((comp,key)=>(
                                    componentLookUp(comp,key)
                                ))}
                        </div>)} */}
                        
                        {/* {(!this.props.showMore || this.state.show) &&( */}
                            <div>
                                    {this.props.components && this.props.components.map((comp,key)=>(
                                        componentLookUp(comp,key)
                                    ))}
                            </div>
                        {/* )} */}
                      
                        {/* {this.props.showMore  &&(<div className="show-more--area" onClick={this.toggleParagraph}>
                            <div className={`arrow ${this.state.show ? "up":"down"}`}></div>
                            <p className="trim-Medium regular--text m-0 show-more">{this.state.text}</p>
                        </div>)} */}
                    </div>
                </div>
                <style jsx global>{`
                    .add--overflow{
                        overflow: auto;
                    } 
                   .color--blue{
                       color:blue;
                   }
                    .para--css{
                        margin-bottom:24px;
                        
                    }
                    .link{
                        color:#E91051;
                        text-decoration: none;
                    }
                    .content__color{
                        color: rgba(25, 10, 40, 0.6);
                    }
                    .wrapper__css{
                        margin-bottom:-24px
                    }
                    .secondary-componet--margin-top{
                        margin-top:24px;
                        overflow: auto;
                    }
                    .arrow {
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        border-top: 1px solid #E91051;
                        border-left: 1px solid #E91051;
                        transition: all 250ms ease-in-out;
                        color: transparent;
                        margin-right:8px;
                      }
                      .arrow.up {
                        transform: rotate(45deg);
                        margin-top: 4px;
                      }
                      
                      .arrow.down {
                        transform: rotate(-135deg);
                        margin-top: -2px;
                      }
                      
                      .show-more--area{
                          display:flex;
                          justify-content:center;
                          align-items: center;
                          padding-top:8px;
                          cursor:pointer;
                      }
                      .show-more{
                          color:#E91051;
                      }
                     
                      @media screen and (min-width: 1224px) {
                        .desktop--padding-24{
                            padding:0 24px;
                        }
                        .para--css{
                            margin-bottom:24px;
                        }
                        .content__wrapper{
                            margin-bottom:-24px
                        }
                        .show-more--area{
                            padding-top:36px;
                        }
                        .arrow {
                            width: 10px;
                            height: 10px;
                            border-top: 2px solid #E91051;
                            border-left: 2px solid #E91051;
                        }
                        .secondary-componet--margin-top{
                            margin-top:56px;
                        }
                        .desktop--padding-24{
                            padding:0 24px;
                         }
                      }
                `}</style>
            </section>
        );
    }
}

export default AllTextComponent;