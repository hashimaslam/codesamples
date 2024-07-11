import React from "react";

function Chevron(props) {
  return (
    <svg
      className={props.className}
      height={props.height}
      width={props.width}
      viewBox="0 0 8 6"
      fill={props.fill}
      xmlns="http://www.w3.org/2000/svg"
    > 
    
      <path
        d="M0.706145 2.41374L3.29615 5.00374C3.68615 5.39374 4.31615 5.39374 4.70615 5.00374L7.29614 2.41374C7.92615 1.78374 7.47614 0.703735 6.58614 0.703735H1.40615C0.516145 0.703735 0.0761452 1.78374 0.706145 2.41374Z"
        fill="#E91051"
      />
    </svg>
  );
}

export default Chevron;
