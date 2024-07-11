import {isEmpty} from "../../config/validation"
import { getHTML } from "../../configs/util";
export const SingleLineText =(props) =>(
    <section>
        <div className="container"> 
            { isEmpty(props.text) && <p className={`${props.cssClassList ? props.cssClassList.join(" ") : "" } `} style={props.styles}>{getHTML(props.text)}</p>}
        </div>
        <style jsx>{`
            p{
                margin:0;
                font-size: 14px;
                line-height: 20px;
            }
            .top--games,.all--games{
                color: #230046;
            }
            .more--faqs{
                color: #230046;
                margin-top:18px;
            }
            @media screen and (min-width: 1224px) {
                .top--games{
                    color: #828282;
                    margin-top:16px;
                    font-size: 24px;
                    line-height: 28px;
                    margin-bottom:48px;
                }
                .all--games{
                    font-size: 36px;
                    line-height: 40px; 
                    margin-top:24px;     
                }
                .more--faqs{
                    font-size: 24px;
                    line-height: 32px;
                    margin-top:36px; 
                }
            }
        `}</style>
    </section>
)