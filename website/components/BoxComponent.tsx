import React, { Component } from 'react';

class BoxComponent extends Component {
    render() {
        return (
            <section className="white__background">
                <div className="container">
                    <div className={this.props.cssClasses}>
                        <div className="content__area">
                            {this.props.dataList.map((box,key)=>(
                                <div className="box__area margin__top_box" key={key}>
                                    <div className="image__section">
                                        <img className="img__css lazy-image" data-src={box.imageData.url} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII=" alt={box.imageData.alt} />
                                    </div>
                                    <div className="text__area">
                                        <h4 className="title">{box.title}</h4>
                                        {box.infoList.map((sent,key)=>(
                                            <div className="list__shap" key={key}>
                                                <div>
                                                        <svg
                                                        className="list-icon"
                                                        viewBox="0 0 8 10"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M3.1 0.200012L0.399994 5.8L0.850001 6.20005H4.00002V9.80001H4.90003L7.59999 4.24439L7.26716 3.80003H4.00002V0.200012H3.1Z"
                                                                fill="#828282"
                                                            />
                                                        </svg>
                                                </div>
                                                <p className="text__css " key={key}>{sent}</p> 
                                            </div>
                                            
                                        ))}
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            
            
                <style jsx>{`
                    .white__background{
                        background: #ffffff;
                    }
                    p,h4{
                        margin:0;
                    }
                    .margin__top_8{
                        margin-top:8px;
                    }
                    .margin__top_box{
                        margin-top:24px;
                    }
                    .margin__reduce{
                        margin-bottom:-16px;
                    }
                    .list-icon{
                        width:8px;
                        height:10px;
                    }
                    .img__css{
                        width:128px;
                        
                    }
                    .list__shap{
                        margin-top:8px;
                        display: flex;
                        align-items: center;
                        
                    }
                  
                    .section-layout__box{
                        padding:32px 24px 48px 24px; 
                    }
                    .text__css{
                        margin-left:8px;
                        text-align:left;
                        font-size: 12px;
                        line-height: 18px;
                        color: rgba(25, 10, 40, 0.6);

                    }
                    .title{
                        font-weight: 600;
                        font-size: 12px;
                        line-height: 16px;
                        text-align:left;
                        font-size: 16px;
                       line-height: 22px;
                       color: #230046;
                    }
                    .text__area{
                        margin-left:16px;
                    }
                    .box__area{
                        display: flex;
                        align-items: center;
                    }

                    @media screen and (min-width: 768px) {
                        .content__area{
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                        }

                        .box__area{
                            width: 33.33%;
                        }

                        .list__shap{
                            margin-top:16px;
                        }
                        .image__section{
                            align-content: flex-start;
                            display: flex;
                            margin-bottom:16px;
                        }
                        .box__area{
                            display: block;
                        }
                        .text__area{
                            margin-left:0;
                        }
                        .section-layout__box{
                            padding:48px 24px 48px 24px; 
                        }
                        .margin__reduce{
                            margin-bottom:0px;
                        }
                    }

                    @media screen and (min-width: 1224px) {
                        .box__area{
                            width: 33.33%;
                        }

                        .list__shap{
                            margin-top:24px;
                        }
                        .image__section{
                            align-content: flex-start;
                            display: flex;
                            margin-bottom:24px;
                        }
                        .section-layout__box{
                            padding:88px 24px 88px 24px; 
                        }
                        .margin__reduce{
                            margin-bottom: 40px;
                        }

                        .text__css{
                            font-size: 20px;
                            line-height: 28px;
                        }
                        .title{
                            font-size: 24px;
                            line-height: 30px;
                        }
                        .list-icon{
                            width:12px;
                            height:16px;
                        }
                    }
                `}</style>
            </section>
        );
    }
}

export default BoxComponent;