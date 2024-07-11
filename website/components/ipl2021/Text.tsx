
// import Image from 'next/image';
export const Text = (props) => ( 
  
    <>
      <props.type className={`${props.cssClasses ? props.cssClasses : "" } `} style={props.styles}>
      {props.text}
      </props.type>
     <style jsx global>
       {`
           .video-title{
            position:absolute;
        }
        
       `}
     </style>
     
     </>
   
 );
 
 