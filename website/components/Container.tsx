
export const Container = (props) => {
    return (
      <div className={`container ${ props.cssClassList ? props.cssClassList.join(" "):""}`}>
     <div className="content" >
         {props.content}
       
      </div>
      <style jsx>
          {`
         .esports-cpl{
             color:#fff;
             background: #190A28;
             padding:48px 0;
             .content{
                font-size: 10px;
                line-height: 14px;
                color: rgba(255, 255, 255, 0.75);
             }
         }
         .placeholder{
            padding:70px 0;
         }

         @media screen and (min-width: 1224px) {
           .esports-cpl{
          .content{
            font-size: 18px;
          }
         
         }

         }
            
          `}
        </style>
      </div>
    );
  };
  