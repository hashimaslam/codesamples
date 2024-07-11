// import Image from 'next/image';
export const CustomImageLazy = (props) => (
  
  <>
    <img
      data-src={props.imageurl.png}
      className={`lazy-image ${props.class} `}
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8UA8AAmUBcaVexNkAAAAASUVORK5CYII="
    />

    <style jsx>{`
    .round-corner{
      border-radius: 16px;
    }
    .steps-icon{
      width:128px;
      height:96px;
    }
    .game-icon{
      width: 80px;
      height: 80px;
    }
    .game-logo{
      width:80px;
      height:44px;
    }
    
    `}</style>
  </>
);
