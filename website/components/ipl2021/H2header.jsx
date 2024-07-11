
import "../../styles/trim_global.scss";

export const H2header = (props) => (
    <>
        {props.header.trim() &&
            <section className="container">
                <div className={`${props.cssClasses}`}>
                    <h2 className={`${props.cssClassList ? props.cssClassList.join(" ") : ""} `} style={props.styles}>{props.header}</h2>
                </div>
            </section>
        }
        <style jsx>
            {`
        
        .testimonial-section-header {
            h2{
                margin:72px 0 24px 0;
                font-weight: 600;
               font-size: 24px;
               line-height: 29px;
               
            }
        }

        .vpl-vip-header {
            text-align: center;
            h2{
                margin:56px 0 12px 18px;
                font-size: 24px;
               line-height: 29px;
               display: flex;
               text-transform: capitalize;
               
            }
        }
  

        @media screen and (min-width: 1224px) {

            .testimonial-section-header {
                h2{
                    font-weight: 600;
                    font-size: 48px;
                    line-height: 56px;
                    margin:0 0 64px 0;   
                }
            }

            .vpl-vip-header {
                h2{
                   
                    margin:120px 0 80px 0;
                    font-weight: 600;
                    font-size: 48px;
                    line-height: 56px;
                    justify-content: center;
                   
                }
            }

        }
        
        
        `}
        </style>
    </>
)