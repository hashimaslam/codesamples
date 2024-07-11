import {isEmpty} from "../../config/validation"

export const OldFooter =(props)=>(
    <div className="background-color">
        <section>
            <div className="container">
                <div className={`footer__area ${props.cssClassList ? props.cssClassList.join(" ") : "" }`}>
                    {props.footerLinks && props.footerLinks.map((link,key)=>(
                        <>
                            {isEmpty(link.link) && isEmpty(link.text) && <div  key={key} className="footer__box">
                                <a href={link.link} className="regular--text trim-Medium">
                                    {link.text}<span className="arrow left"></span>
                                </a>
                            </div>}
                        </>
                    ))}
                </div>
            </div>
        </section>
        <style jsx>{`

        .footer__area{
            display: flex;
            flex-wrap: wrap;
            justify-content: left;
            padding:10px 0px;
        }
        .background-color{
            background: #F4F3F4;
        }
        .footer__box{
            width:50%;  
            color: #E91051;
            padding:6px 0px;
            padding-right:10px;
        }
        .arrow {
            display: inline-block;
            width: 5px;
            height: 5px;
            border-top: 1.5px solid #E91051;
            border-left: 1.5px solid #E91051;
            transition: all 250ms ease-in-out;
            color: transparent;
            margin-left:6px;
          }
          .arrow.left {
            transform: rotate(135deg);
          }
        @media screen and (min-width: 1224px) {
            .arrow {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-top: 2px solid #E91051;
                border-left: 2px solid #E91051;
            }
            .background-color{
                background: #FFF;
            }
            .footer__box{
                width:25%;
                padding:16px;  
            }
        }
        `}</style>
    </div>
)