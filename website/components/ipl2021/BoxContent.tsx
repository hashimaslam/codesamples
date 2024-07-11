export const BoxContent=(props)=>(
    <section className={props.backgroundCss}>
        <div className="container">
            <div className={props.cssClassList}>
                <div className="comp__area remove--last-padding">
                    {props.content && props.content.map((box,key)=>(
                        <div className="box__area" key={key}>
                            {box.imgUrl && (<img 
                                        className="lazy-image img__css" 
                                        src={box.imgUrl.png}
                                        // src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
                                        alt={box.imgUrl.alt}
                                        width="128"
                                        height="96"
                            />)}
                            <div className="text__area">
                                <h4 className="title__css trim-semiBold m-0">{box.title}</h4>
                                <p className="regular--text trim-Regular m-0 text__color">{box.text}</p>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <style jsx>{`
            .content--align-center{
                .box__area{
                    align-items: center;
                }
                .regular--text{
                    font-size: 14px;
                    line-height: 20px;
                    color: #230046;
                }
            }
            .box__area{
                display:flex;
                padding-bottom:24px;
            }
            .img__css{
                width:128px;
                height:96px;
            }
            .fantasy-cricket{
                .img__css{
                    width:128px;
                    height:268px;
                }
            }
            .remove--last-padding{
                margin-bottom:-24px;
                padding:0px;
            }
            .title__css{
                font-size: 16px;
                line-height: 20px;
                color: #230046;
                margin-bottom:8px;
            }
            .text__area{
                margin: 0px 16px;
                margin-right: 0;
            }
            .text__color{
                color: rgba(25, 10, 40, 0.6);
            }
            .bubble--shooter{
                .img__css{
                    width:80px;
                    height:80px;
                }
            }
            @media screen and (min-width: 1224px) {

                .comp__area{
                    width:692px;
                    margin:auto;
                }
                .box__area{
                    display:flex;
                    padding-bottom:48px;
                }
                .img__css{
                    width:156px;
                    height:156px;
                }
                .bubble--shooter{
                    .img__css{
                        width:156px;
                        height:156px;
                    }
                }
                .fantasy-cricket{
                    .img__css{
                        min-width:256px;
                        height:400px;
                    }
                }
                .remove--last-padding{
                    margin-bottom:-48px;
                    padding:0px;
                }
                .title__css{
                    font-size: 24px;
                    line-height: 28px;
                    color: #230046;
                    margin-bottom:16px;
                }
                .text__area{
                    margin: 16px 24px;
                    margin-right: 0;
                }
                .content--align-center{
                    .regular--text{
                        font-size: 20px;
                        line-height: 24px;
                    }
                }
            }
        `}</style>
    </section>
)