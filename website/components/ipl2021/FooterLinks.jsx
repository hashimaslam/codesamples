import { isEmpty } from "../../config/validation"

const GameSection = (props) => {
    const linkClicked = (link) => {
        if (window.location.pathname === "/esports/arena" || window.location.pathname === "/esports/dailyseries") {
            let buttoname = '';
            if (link.indexOf('facebook') > 0) {
                buttoname = 'facebook';
            }
            if (link.indexOf('twitter') > 0) {
                buttoname = 'twitter';
            }
            if (link.indexOf('instagram') > 0) {
                buttoname = 'instagram';
            }

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'socialLinksClicked',
                ButtonName: buttoname,
                LocationOfAction: "footer",
                Game: ""

            });
        }
    }

    const socialLinksClicked = (name) => {
        if (window.location.pathname === "/esports/arena" || window.location.pathname === "/esports/dailyseries") {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: `${name}_clicked`,
                ButtonName: name,
                LocationOfAction: "footer",
                Game: name
            });
        }
    }

    return (
        <div className={"game--area " + props.game?.cssClasses + " " + props.cssClasses}>
            {props.game?.gameTypeName && <h4 className="trim-Medium title">{props.game.gameTypeName}</h4>}
            {props.game?.games && props.game.games.map((link, key) =>
                <a className="link--area trim-Regular" href={link.link} key={key} onClick={() => socialLinksClicked(link.name)} >
                    {link.name}
                </a>)}
            {props.game?.iconLinks && <div className="social--links">
                {props.game?.iconLinks.map((social, key) => (
                    <a key={key} onClick={() => linkClicked(social.link)} href={social.link} key={key}>
                        <img className="img--css" src={social.imgUrl?.png} alt={social.imgUrl?.alt} />
                    </a>
                ))}
            </div>}
            <style jsx>{`
            .title{
                margin:0;
                font-size: 14px;
                line-height: 20px;
                margin-bottom:8px;
                color: #230046;
                text-align: left;
            }
            .link--area{
                font-size: 12px;
                line-height: 18px;
                color: rgba(25, 10, 40, 0.6);
                display:block;
                padding-bottom:8px;
                text-align: left;
            }
            .game--area{
                margin-bottom:-8px;
                padding-bottom:24px;
            }
            .title--type--links{
                .link--area{
                    font-weight: 600;
                    font-size: 14px;
                    line-height: 18px;
                    color: #230046;
                    display:block;
                    padding-bottom:8px;
                }
            }
            .img--css{

                width:20px;
                height:20px;
                margin-right:16px;
                margin-top: 12px;
            }
            .social--links{
                display: flex;
                justify-content: flex-start;
            }
            .old--page{
                .link--area{
                    font-family: 'Roboto';
                    font-weight: 400;
                }
                .title--type--links{
                    .link--area{
                        font-family: 'Roboto';
                        font-weight: 400;
                    }
                }
                .title{
                    font-family: 'Roboto';
                    font-weight: 500;

                }
            }
            @media screen and (min-width: 1224px) {
                .title{
                    font-size: 16px;
                    margin-bottom:20px;
                    font-weight: 400;

                }
                .title--type--links{
                    .link--area{
                        font-size: 16px;
                        line-height: 20px;
                        padding-bottom:14px;
                        font-weight: 400;
    
                    }
                }
                .link--area{
                    font-size: 16px;
                    line-height: 20px;
                    display:block;
                    padding-bottom:14px;
                    text-align: left;
                }
                .game--area{
                    margin-bottom:-14px;
                    padding-bottom:40px;
                }
                .old--page{
                    .link--area{
                        font-family: 'Roboto';
                        font-weight: 400;
                    }
                    .title--type--links{
                        .link--area{
                            font-family: 'Roboto';
                            font-weight: 400;
                        }
                    }
                    .title{
                        font-family: 'Roboto';
                        font-weight: 500;
    
                    }
                }
            }
        `}</style>
        </div>
    )
}

const MobileFooterLinks = (props) => (
    <div className="list--area">
        {props.footerLinks && props.footerLinks.map((gameType, key) => (
            <div className="vertical--game--section" key={key}>
                {gameType && gameType.map((game, key) => <GameSection game={game} key={key} cssClasses={props.cssClasses} />)}
            </div>
        ))}
        <style jsx>{`
            .list--area{
                display: flex;
                justify-content: space-between;
            }
        `}</style>
    </div>
)



export const FooterLinks = (props) => {

    const linkClicked = (linkname) => {
        if (window.location.pathname === "/esports/arena" || window.location.pathname === "/esports/dailyseries") {
            window.dataLayer = window.dataLayer || [];
            let eventName = "";
            switch (linkname.toLowerCase()) {
                case "privacy policy":
                    eventName = "Privacy_policy_clicked";
                    break;
                case "vpl fairplay":
                    eventName = "vpl_fairplay_clicked";
                    break;
                case "terms & condition":
                    eventName = "Terms&Conditions";
                    break;
            }

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: eventName,
                ButtonName: linkname,
                LocationOfAction: "footer",
                Game: ''
            });
        }
    }

    return (
        <div className={props.cssClasses}>
            <section className="white--background">
                <div className="container">
                    {props.device !== "desktop" && <MobileFooterLinks footerLinks={props.mobileFooterLinks} cssClasses={props.cssClasses} />}
                    {props.device !== "desktop" && <div className="bottom--area">
                        <div className="about--us-links">
                            {props.aboutUsLinks && props.aboutUsLinks.map((link, key) => (
                                <a href={link.link} key={key} className="trim-Medium link--css" onClick={() => linkClicked(link.name)}>{link.name} {key !== props.aboutUsLinks.length - 1 ? <span className="vertical-line"></span> : ""}</a>
                            ))}
                        </div>
                        <hr />
                        <p className="copy-right trim-Regular"> {props.copyRight}</p>
                    </div>}
                    {props.device === "desktop" && <div>
                        <div className="desktop--top--line" />
                        <MobileFooterLinks footerLinks={props.desktopFooterLinks} cssClasses={props.cssClasses} />
                        <div className="desktop--bottom--line" />
                        <div className="copy--right--section">
                            <div className="copy-right">
                                {props.copyRight}
                            </div>
                            <div className="links--wrapper">
                                {props.aboutUsLinks && props.aboutUsLinks.map((link, key) => (
                                    <a href={link.link} key={key} className="trim-Regular desktop--links" onClick={() => linkClicked(link.name)}>{link.name} {key !== props.aboutUsLinks.length - 1 ? <span className="vertical-line">|</span> : ""}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </section>
            <style jsx>{`

        .footer__area{
            display: flex;
            flex-wrap: wrap;
            justify-content: left;
            padding:10px 0px;
        }
       .white--background{
           background:#fff;
       }
        .container{
            padding: 0 32px;
        }
        .vertical-line{
            margin:3px 8px;
            border-left: 0.5px solid #000000;
        }
        .link--css{
            font-size: 12px;
            line-height: 18px;
            color: rgba(25, 10, 40, 0.6);
            display:flex;
        }
        .about--us-links{
            margin-top:12px;
            margin-bottom:32px;
            display: flex;
            justify-content: flex-start;
        }
        .copy-right{
            font-size: 10px;
            line-height: 12px;
            text-align: center;
            color: rgba(25, 10, 40, 0.6);
        }
        .desktop--top--line{
            margin-bottom:40px;
            border: 1px solid #190A28;
            opacity: 0.1;
        }
        .desktop--bottom--line{
            margin-bottom:24px;
            border: 1px solid #190A28;
            opacity: 0.1;
        }
        .old--page{
            .copy-right{
                font-family: 'Roboto';
                font-weight: 400;
            }
            .desktop--links{
                font-family: 'Roboto';
                font-weight: 400;
            }
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
            .desktop--links{
                font-size: 16px;
                line-height: 20px;
                color: rgba(25, 10, 40, 0.6);
                display:block;
            }
            .copy-right{
                font-size: 16px;
                line-height: 20px;
                color: rgba(25, 10, 40, 0.6);

            }
            .copy--right--section{
                display: flex;
                justify-content: space-between;
            }
            .links--wrapper{
                display: flex;
            }
            .vertical-line{
                margin:0px 8px;
                border-left:none;
            }
        }
        `}</style>
        </div>
    );
}