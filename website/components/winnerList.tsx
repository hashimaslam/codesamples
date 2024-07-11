import React, { useState, useEffect } from "react";
import { getHTML } from "../configs/util";
import Modal from "react-modal";
import "../styles/modal.scss";


const WinnerList = (props) => {
  const [showModal, setShowModal] = useState(true);
  const [listType, setListType] = useState("zo");
//   useEffect(() => {
   
//     setTimeout(() => {
//       setShowModal(true);
//     }, 3000);
// }, []); 

  
  
 

  const renderZone = () => {
  
  }


  const renderCollege = () => {
     
  }

  const selectZone = (zoneid) => {
    
  }

  const selectCollege = (collegeid) => {
    
  }

  const openListModal = () => {};
  return (
    <div>
     <div className="header"><img src="static/2x/back-arrow.svg" />
     <img src="static/2x/location.svg" />
     </div>
     <style jsx>
     {
         `
         .header{
             display:flex;
         }
         
         
         `
     }
     </style>
    </div>
  );
};

export default WinnerList;
