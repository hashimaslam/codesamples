

export const LinkImageButton = (props) => ( 
   <>
      <a href={props.href} className={`${props.cssClasses ? props.cssClasses : ""} `}><img src={props.imageUrl}/></a>
     <style jsx>
       {`
         .action-link--banner--ios{
          width: 144px;
          height: 48px;
          position: absolute;
          bottom: 38px;
          img{
            max-width: none;
           }
         }

         .action-link--footer--ios{
          width: 144px;
          height: 48px;
         }

        
       `}
     </style>
     
     </>
   
 );
 
 