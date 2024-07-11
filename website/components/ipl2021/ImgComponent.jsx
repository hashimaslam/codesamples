export const ImgComponent =(props) =>(
    <section>
        <div className="container">
            <div className={props.cssClassList}>
                {props.imgUrl &&<img className={` img__css ${props.imgCssClassList ? props.imgCssClassList.join(" ") : ""}`} src={props.imgUrl.png} alt={props.imgUrl.alt}/>}
            </div>
        </div>
        <style jsx>{`
            .img__css{
                display:block;
            }
            .logo--css{
                width: 80px;
                height: 26px;
                margin-bottom: 24px;
            }
            .rating--css{
                width:100%;
            }
            @media screen and (min-width: 1224px) {
                .logo--css{
                    width: 160px;
                    height: 51px;
                    margin-bottom: 30px;
                }
                .rating--css{
                    width:800px;
                    height:306px;
                }
            }
            
        `}</style>
    </section>
)