export const VideoComponent =(props) =>(
    <section>
        <div className="container">
            <div className={`${props.cssClassList ? props.cssClassList.join(" ") : "" }`}>
                <div className={"main--section "} >
                    <iframe className="video__section" src={props.videoLink}>
                    </iframe>
                    <div className="img__section">
                        <img className="img__css" src={props.nameSvg} alt={props.alt}/>
                    </div>
                </div>
            </div>
        </div>
        <style jsx>{`
            .video__section{
                height:222px;
                width:100%;
            }
            .container{
                margin:0px !important;
            }
            .img__css{
                margin-top: -40px;
                position: absolute;
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
            }
        `}</style>
    </section>
)