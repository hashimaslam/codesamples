import React, { Component } from 'react';

class TextualContentComponent extends Component {
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
                    <div className={`${this.props.cssClassList ? this.props.cssClassList.join(" ") : ""}`} >

                        {/* {(this.props.showMore && !this.state.show) &&(<div className="content__wrapper">
                                {this.props.firstContentToShow && <p className="regular--text trim-Regular m-0 para--css" style={this.props.paraStyle}>{this.props.firstContentToShow}</p>}
                        </div>)} */}

                         {/* {(!this.props.showMore || this.state.show) &&(<div className="content__wrapper">
                            {this.props.description && this.props.description.map((con,key)=>(
                                <p className="regular--text trim-Regular m-0 para--css" key={key} style={this.props.paraStyle}>{con}</p>
                            ))}
                        </div>)} */}

                        <div className="content__wrapper">
                            {this.props.description && this.props.description.map((con,key)=>(
                                <p className="regular--text trim-Regular m-0 para--css" key={key} style={this.props.paraStyle}>{con}</p>
                            ))}
                        </div>
                        {/* {this.props.showMore  &&(<div className="show-more--area" onClick={this.toggleParagraph}>
                            <div className={`arrow ${this.state.show ? "up":"down"}`}></div>
                            <p className="trim-Medium regular--text m-0 show-more">{this.state.text}</p>
                        </div>)} */}
                    </div>
                </div>
                <style jsx>{`
                    .add--overflow{
                        overflow: auto;
                    } 
                    .disclaimer{
                        background: rgba(25, 10, 40, 0.05);
                    }
                    .para--css{
                        margin-bottom:12px;
                        color: rgba(25, 10, 40, 0.6);
                    }
                    .content__wrapper{
                        margin-bottom:-12px
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
                          padding-top:20px;
                          cursor:pointer;
                      }
                      .show-more{
                          color:#E91051;
                      }
                    x
                      .disclaimer-container{
                        padding:10px 0;
                    }
                    .copyright-section{
                        padding-bottom:100px;
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
                          .disclaimer-container{
                            padding:20px 0;
                        }
                      }
                    
                `}</style>
            </section>
        );
    }
}

export default TextualContentComponent;