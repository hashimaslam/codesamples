import React, { Component } from 'react';
import {getHTMLwithSpan} from "../configs/util";

class PageInfoShowMore extends Component {
    constructor(props) {
        super(props);
        this.state={
            show:false
        }
    }
  toggle = () =>{
      this.setState({show:!this.state.show});
  }
    render() {
        return (
            <section className={`page-info-section ${ this.props.cssClassList ? this.props.cssClassList.join(" ") : ""}`}>
            <div className="container">
              <div className="section-layout page-info-layout">
                <div>
                  {this.props.header ? (
                    this.props.H1Header ? (
                      <h1 className="section-header section-header--medium main-header">
                        {this.props.header}
                      </h1>
                    ) : (
                      <h2 className="section-header section-header--medium">
                        {this.props.header}
                      </h2>
                    )
                  ) : (
                    ""
                  )}
                  {this.props.subHeader ? (
                    <h2 className="section-header section-header--medium">
                      {this.props.subHeader}
                    </h2>
                  ) : (
                    ""
                  )}
      
                    <div className={` show__content_min_768 ${this.state.show ? 'show__content':'hide__content'}`}>
                        {this.props.contentList &&
                            this.props.contentList.map((para, i) => {
                            return (
                                <p key={i} className="page-info-description">
                                {getHTMLwithSpan(para)}
                                </p>
                            );
                            })}

                            {this.props.pageLink ? (
                                <div className="row page-info-row">
                                    <p className="page-info-description">
                                    <span className="know-more">
                                        <a href={this.props.pageLink}>Click here </a>{" "}
                                        {getHTMLwithSpan(this.props.pageLinkContent)}
                                    </span>
                                    </p>
                                </div>
                                ) : (
                                ""
                            )}

                    
                    </div>
                    {this.props.showMoreContentLine && (<div className={this.state.show ? 'hide__content':'show__content'}>
                            <p  className="page-info-description">
                                        {getHTMLwithSpan(this.props.showMoreContentLine)}
                            </p>
                    </div>)}
                    {this.props.showMoreText && (<div className={`width_100_per ${this.state.show ? 'hide__content ':'show__content'}`} onClick={this.toggle}>

                        <div className="align__text__icon">
                            <p className="show__hide">{this.props.showMoreText}</p>
                            <div>
                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.94 0.726562L4 3.7799L7.06 0.726562L8 1.66656L4 5.66656L0 1.66656L0.94 0.726562Z" fill="#FF1E46"/>
                                </svg>

                            </div>
                        </div>

                    </div>)}
                    {this.props.showLessText && (<div className={`width_100_per ${this.state.show ? 'show__content':'hide__content'}`} onClick={this.toggle}>

                        <div className="align__text__icon">
                            <p className="show__hide">{this.props.showLessText}</p>
                            <div>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.4425 5.55664L5 2.12164L1.5575 5.55664L0.5 4.49914L5 -0.000859261L9.5 4.49914L8.4425 5.55664Z" fill="#FF1E46"/>
                                </svg>


                            </div>
                        </div>
                    </div>)}    
                 
                </div>
              </div>
            </div>
            <style jsx global>
            {`
              .page-info-section a {
                all: inherit;
                display: inline;
                cursor: pointer;
                color: #ff0000;
                -webkit-text-fill-color: #ff1e46;
                font-weight:500;
              }
            `}
          </style>
            <style jsx>
              {`
                
                .grey__background{
                   background: #F0F0F0 !important;
                }
                .show__content{
                    display:block;
                }
                .hide__content{
                    display:none;
                }
                .align__text__icon{
                    align-items: center;
                    display: flex;
                    justify-content: flex-end;
                    cursor: pointer;
                }
                .width_100_per{
                    width:100%;
                }
                .show__hide{
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 16px;
                    color: #FF1E46;
                    margin-right:5px;
                }
                .page-info-section {
                  background: #ffffff;
                  .page-info-description {
                    font-size: 12px;
                    line-height: 16px;
                    text-align:left;
                  }
                }
                .page-info-section a {
                  all: inherit;
                  display: inline;
                  cursor: pointer;
                  color: #ff0000;
                  font-weight:500;
                }
                @media screen and (min-width: 768px) {
                
                .show__content_min_768{
                      display:block !important;
                }
                .grey__background{
                    background: #FFFFFF !important;
                }
                .show__content{
                    display:none;
                }
                .hide__content{
                    display:none;
                }
                  .page-info-section {
                    .page-info-layout {
                      margin-bottom: -20px;
                    }
                    .page-info-description {
                      font-size: 14px;
                      line-height: 19px;
                      text-align:center;
                    }
                  }
                }
      
                @media screen and (min-width: 1224px) {
                 
                  .page-info-section {
                    .page-info-description {
                      font-size: 20px;
                      line-height: 28px;
                    }
                  }
                }
              `}
            </style>
          </section>
        );
    }
}

export default PageInfoShowMore;