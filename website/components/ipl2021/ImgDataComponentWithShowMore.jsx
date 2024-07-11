import React, { Component } from 'react';

class ImgDataComponentWithShowMore extends Component {
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
                        <div className="content__wrapper" onClick={this.toggleParagraph}>
                            <img className="img__css" src={this.props.imgUrl.png} alt={this.props.imgUrl.alt}/>
                            <p className="regular--text trim-Regular m-0 show--text">{this.props.firstLine}</p>
                        </div>

                         {(this.state.show) &&(<div className="content">
                            {this.props.description.map((con,key)=>(
                                <div className="row__data">
                                    <div className="icon--css">
                                        <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.1004 0.199997L0.400391 5.79999L0.850397 6.20004H4.00041V9.8H4.90043L7.60039 4.24437L7.26756 3.80001H4.00041V0.199997H3.1004Z" fill="#E91051"/>
                                        </svg>
                                    </div>
                                    <p className="regular--text trim-Regular m-0 para--css">
                                        <b className="trim-Bold">{con.substring(0, con.indexOf(":")+1)}</b>
                                        {con.substring(con.indexOf(":")+1)}
                                    </p>
                                </div>
                            ))}
                        </div>)}

                        {this.props.showMore &&(<div className="show-more--area" onClick={this.toggleParagraph}>
                            <div className={`arrow ${this.state.show ? "up":"down"}`}></div>
                            <p className="trim-Medium regular--text m-0 show-more">{this.state.text}</p>
                        </div>)}
                    </div>
                </div>
                <style jsx>{`

                    .para--css{
                        color: rgba(25, 10, 40, 0.6);
                        margin-left:8px;
                    }
                    .show--text{
                        color: rgba(25, 10, 40, 0.6);
                        margin-bottom:16px;
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
                        margin-bottom:-16px;
                    }
                    .img__css{
                        margin-bottom:16px;
                        height:160px;
                    }
                    .icon--css{
                        width:10px;
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
                          margin-top:20px;
                      }
                      .show-more{
                          color:#E91051;
                      }
                      
                      
                `}</style>
            </section>
        );
    }
}

export default ImgDataComponentWithShowMore;