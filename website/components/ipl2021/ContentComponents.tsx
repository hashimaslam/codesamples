import { getHTML, getHTMLParagraph } from "../../configs/util";

export const WithListContent = (props) => (
  <div className={props.cssClassList + " wrapper__css"}>
    {props.description &&
      props.description.map((rows, key) => (
        <div className="row__data" key={key}>
          <div className="icon--css">
            <svg
              width="8"
              height="10"
              className="icon--size"
              viewBox="0 0 8 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.1004 0.199997L0.400391 5.79999L0.850397 6.20004H4.00041V9.8H4.90043L7.60039 4.24437L7.26756 3.80001H4.00041V0.199997H3.1004Z"
                fill={props.iconColor ? props.iconColor : "#E91051"}
              />
            </svg>
          </div>
          <div className="text__area">
            {props.ishtmlContent ? (
              <>
                {rows.content &&
                  rows.content.map((row, key) => (
                    <p
                      className="regular--text trim-Regular m-0 content__color padding--bottom"
                      key={key}
                    >
                      {/* <span className="heading__color">
                        {getHTMLParagraph(row.substring(0, row.indexOf(":") + 1))}
                      </span> */}
                      <span className="heading__color">{row.indexOf('https:') === -1 && getHTMLParagraph(row.substring(0, row.indexOf(":")+1))}</span>
                       {/* {getHTMLParagraph(row.substring(row.indexOf(":") + 1))} */}
                       {row.indexOf('https:') > -1 ? getHTMLParagraph(row.substring(row)) : getHTMLParagraph(row.substring(row.indexOf(":")+1))}
                    </p>
                  ))}
              </>
            ) : (
              <>
                {rows.content &&
                  rows.content.map((row, key) => (
                    <p
                      className="regular--text trim-Regular m-0 content__color padding--bottom"
                      key={key}
                    >
                      {getHTML(row)}
                      {/* <span className="heading__color">
                        {getHTML(row.substring(0, row.indexOf(":") + 1))}
                      </span>
                      {getHTML(row.substring(row.indexOf(":") + 1))} */}
                    </p>
                  ))}
              </>
            )}
            {rows.normalContent &&
              rows.normalContent.map((row, key) => (
                <p
                  className="regular--text trim-Regular m-0 content__color padding--bottom"
                  key={key}
                >
                  {getHTML(row)}
                </p>
              ))}
          </div>
        </div>
      ))}
    <style jsx>{`
      .row__data {
        display: flex;
        padding-bottom: 24px;
      }
      .icon--css {
        min-width: 20px;
      }
      .heading__color {
        color: #190a28;
      }
      .text__area {
        margin-bottom: -16px;
      }
      .padding--bottom {
        padding-bottom: 16px;
      }
      .icon--size {
        width: 11px;
        height: 14px;
        color: #e91051;
      }
      @media screen and (min-width: 1224px) {
        .icon--css {
          min-width: 30px;
        }
        .icon--size {
          width: 13px;
          height: 17px;
          margin-top: 3px;
        }
      }
    `}</style>
  </div>
);

export const TextualContent = (props) => (
  <div className={props.cssClassList + " remove--padding--last"}>
    {props.description &&
      props.description.map((row, key) => (
        <p
          className="regular--text trim-Regular m-0 content__color padding--bottom"
          key={key}
        >
          {getHTML(row)}
        </p>
      ))}
    <style jsx>{`
      .padding--bottom {
        padding-bottom: 16px;
      }
      .remove--padding--last {
        margin-bottom: -16px;
      }
      @media screen and (min-width: 1224px) {
        .padding--bottom {
          padding-bottom: 24px;
        }
        .remove--padding--last {
          margin-bottom: -24px;
        }
      }
    `}</style>
  </div>
);

export const H4Content = (props) => (
  <div className={props.cssClassList + " remove--padding--last"}>
    {props.description &&
      props.description.map((row, key) => (
        <h4
          className="trim-Regular m-0 content__color padding--bottom"
          key={key}
        >
          {getHTML(row)}
        </h4>
      ))}
    <style jsx>{`
      .padding--bottom {
        padding-bottom: 16px;
      }
      .remove--padding--last {
        margin-bottom: -16px;
      }
      @media screen and (min-width: 1224px) {
        .padding--bottom {
          padding-bottom: 24px;
        }
        .remove--padding--last {
          margin-bottom: -24px;
        }
      }
    `}</style>
  </div>
);

export const VerticalImg = (props) =>(
  <div className={props.cssClassList}>
      <picture>
          <source srcSet={props.imgUrl.webp} type="image/webp" />
          <source srcSet={props.imgUrl.png} type="image/png" />
          <img
            src={props.imgUrl.png}
            alt={props.imgUrl.alt}
            style={props.styles}
            width={props.imgUrl.width}
            height={props.imgUrl.height}
            loading="lazy"
           />
        </picture>

  <style jsx>{`

  .img-css{
      img{
          width:244px;
          height:442px;
          display: block;
          margin:auto;
          
      }
  } 
  .bowling__css{
      margin-top:12px;
      img{
          width:343px;
          height:441px;
          display: block;
          border-radius: 8px;
          margin:auto;
      }
  }
  .fantasy-games{
    img{
      margin: auto;
      display: block;
      width:244px;
      height:442px;
      border-radius: 8px;
    }
  }
  @media screen and (max-width: 420px) {
      .bowling__css{
          img{
              width:100%;
              display: block;
              border-radius: 8px;
              margin:auto;
          }
      } 
      
  }

  @media screen and (min-width: 1224px) {
      .img-css{
          img{
              width:360px;
              height:652px;
              display: block;
              border-radius: 8px;
              margin:auto;
          }

      } 
      .bowling__css{
          margin-top:24px;
          img{
              width:360px;
              height:463px;
              display: block;
              border-radius: 8px;
              margin:auto;
          }
      }
      .fantasy-games{
        img{
            width:360px;
            height:524px;
            display: block;
            margin:auto;
        }
      } 
  }
      
  `}</style>
</div>
)

export const HorizontalImg = (props) =>(
  <div className={props.cssClassList}>
      <picture>
          <source srcSet={props.imgUrl.webp} type="image/webp" />
          <source srcSet={props.imgUrl.png} type="image/png" />
          <img
            src={props.imgUrl.png}
            alt={props.imgUrl.alt}
            style={props.styles}
            width={props.imgUrl.width}
            height={props.imgUrl.height}
            loading="lazy"
           />
        </picture>
  <style jsx>{`

  .img-css{
      img{
          width:343px;
          height:160px;
          display: block;
          margin:auto;
      }
  }
  .carrom-img{
      padding:0 48px;
      img{
          width: 267px;
          height: 315px;
          display: block;
          margin:auto;
      }
  } 
  .fruit__chop--css {
      img{
          width:312px;
          height:160px;
          display: block;
          border-radius: 8px;
          margin:auto;
      }
  } 
  @media screen and (max-width: 375px) {
      .carrom-img{
          padding:0 48px;
          img{
              width: 100%;
              height: auto;
              display: block;
              margin:auto;
          }
      } 
  }
  @media screen and (max-width: 411px) {
      .img-css{
          img{
              width:100%;
              height:160px;
          }
      } 
  }
  @media screen and (min-width: 1224px) {
      .img-css{
          img{
              width:800px;
              height:408px;
              display: block;
              border-radius: 8px;
              margin:auto;
          }
      } 
      .hand__rank{
        img{
          height:300px;
        }
      }
      .fruit__chop--css {
          img{
              width:720px;
              height:370px;
              display: block;
              border-radius: 8px;
              margin:auto;
          }
      } 
  }
      
  `}</style>
</div>
)

export const TabluarTwoColComponent =(props)=>(
  <div className={props.cssClassList}>
      {props.tabularData && props.tabularData.map((row,key)=>(
        <div className="table__row" key={key} style={{background: key%2 ? "":"rgba(25, 10, 40, 0.05)"}}>
            <p className="regular--text trim-Regular col1" style={!row.headingColor ? {}:row.headingColor}>
                {getHTML(row.col1)}
            </p>
            <p className=" regular--text trim-Regular col2" style={!row.color ? {} :row.color}>
                {getHTML(row.col2)}
            </p>
        </div>
    ))}
    <style jsx>{`

        .col1{
          margin:0;
          width:50%;
          padding-right:10px;
        }

        .col2{
          margin:0;
          width:50%;
          padding-left:10px;
          text-align: right;
        }
        .table__row{
          display:flex;
          padding:16px 8px;
          color: rgba(25,10,40,0.6);
        }
        @media screen and (min-width: 768px) {
          .outside--table{
            border: 1px solid #E6E6E6;
            border-radius: 8px;
            padding: 12px;
          }
        }
        @media screen and (min-width: 1224px) {

        }
    
    `}</style>
  </div>
)

export const BoxRow =(props)=>(
  <div className={props.cssClassList +" row--css"}>
            <p className="regular--text trim-Regular">
                {getHTML(props.row)}
            </p>
          
    <style jsx>{`

      .grey--background{
        background: rgba(25, 10, 40, 0.05);
      }
      p{
        margin:0;
      }
      .row--css{
        padding:10px;
        color: rgba(25, 10, 40, 0.6);
      }
        @media screen and (min-width: 768px) {
         
        }
        @media screen and (min-width: 1224px) {

        }
    
    `}</style>
  </div>
)

export const BoxUlRow =(props)=>(
  <div className={props.cssClassList+" row--css"}>
            <p className="regular--text trim-Regular">
                {getHTML(props.row)}
            </p>
            <ul>
            {props.listData && props.listData.map((listItam,key)=>(
                <li className="regular--text trim-Regular " key={key}>
                    {getHTML(listItam)}
                </li>
             ))}
         </ul>
           
    <style jsx>{`

        .grey--background{
          background: rgba(25, 10, 40, 0.05);
        }
        ul,p{
          margin:0;
          
        }
        li{
          text-transform: none;
        }
        .row--css{
          padding:10px;
          color: rgba(25, 10, 40, 0.6);
        }
        @media screen and (min-width: 768px) {
         
        }
        @media screen and (min-width: 1224px) {

        }
    
    `}</style>
  </div>
)