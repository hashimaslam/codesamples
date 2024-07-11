import React, { Component } from 'react';
import '../styles/carousel.scss';
import {getHTML} from "../configs/util";


const CarouselPart1 = ({slideLeftArr,translateX,slideWidth,slideHeight,data}) =>{
    return(<>
          {data.map((slide,key) => (
               <picture key={key}>
                    <source srcSet={slide.webp} type="image/webp" />
                    <source srcSet={slide.png} type="image/png" />
    
                    <img
                        className="image__css"
                        style={
                                { 
                                    width:slideWidth,
                                    height:slideHeight,
                                    left:slideLeftArr[key] + 'px',
                                    transform:`translateX( ${translateX}px)`,
                                    transition: 'transform 250ms ease-in'
                                
                                }
                            }
                        src={slide.png}
                        alt={slide.alt}
                    />
             </picture>
          ))}
    </>)
}

const RenderStars = ({stars}) =>{
    const arr=[];
    for(let i=0;i<5;i++){
        if(i < stars)
            arr.push(true);
        else    
            arr.push(false);
    }
    return(
        <div>  
            {arr.map((val,key)=>{
                if(key==0)
                    return (    <svg key={key} className="star__style" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill={val ? "#FF1E46" : "#C4C4C4"} d="M11.6816 4.29252L7.99257 3.72902L6.33907 0.207016C6.21557 -0.0559844 5.78407 -0.0559844 5.66057 0.207016L4.00757 3.72902L0.318575 4.29252C0.0155746 4.33902 -0.105425 4.70752 0.107075 4.92502L2.78707 7.67202L2.15357 11.5555C2.10307 11.864 2.43257 12.0955 2.70507 11.944L6.00007 10.123L9.29507 11.9445C9.56507 12.0945 9.89757 11.8675 9.84657 11.556L9.21307 7.67252L11.8931 4.92552C12.1056 4.70752 11.9841 4.33902 11.6816 4.29252Z"/>
                                </svg>
                            )
                else
                    return (<svg key={key} className="star__style margin__left__stars" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill={val ? "#FF1E46" : "#C4C4C4"} d="M11.6816 4.29252L7.99257 3.72902L6.33907 0.207016C6.21557 -0.0559844 5.78407 -0.0559844 5.66057 0.207016L4.00757 3.72902L0.318575 4.29252C0.0155746 4.33902 -0.105425 4.70752 0.107075 4.92502L2.78707 7.67202L2.15357 11.5555C2.10307 11.864 2.43257 12.0955 2.70507 11.944L6.00007 10.123L9.29507 11.9445C9.56507 12.0945 9.89757 11.8675 9.84657 11.556L9.21307 7.67252L11.8931 4.92552C12.1056 4.70752 11.9841 4.33902 11.6816 4.29252Z"/>
                             </svg>
                            )
                
            })}
        </div>
    )

}

const CarouselPart2 = ({slideLeftArr,translateX,slideWidth,slideHeight,data}) =>{
    return(
        <>
           {data.map((slide,key) =>( <div
                className="slide__css"
                key={key}
                style={
                    { 
                        width:slideWidth,
                        height:slideHeight,
                        left:slideLeftArr[key] + 'px',
                        transform:`translateX( ${translateX}px)`,
                        transition: 'transform 250ms ease-in'
                    
                    }
                }
            >
                <div className="slide__content">
                    <div className="profile__section">
                        <img className="profile__css" src={slide.profileImg.png} alt={slide.profileImg.alt}/>
                        <div className="name__rating_section">
                            <h3 className="user__name">
                                {slide.name}
                            </h3>
                            <div>
                                <RenderStars
                                    stars={slide.stars}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="user__words">
                        {slide.info}
                    </p>
                </div>
        
        </div>))}
    </>)
}

const factoryComponets = {  
    "CarouselPart1": CarouselPart1,
    "CarouselPart2": CarouselPart2
}

const componentLookUp = (
    name,
    slideLeftArr,
    translateX,
    slideWidth,
    slideHeight,
    data
    )=>{
    const Component = factoryComponets[name];
   
    return <Component 
                slideLeftArr={slideLeftArr}
                translateX={translateX}
                slideWidth={slideWidth}
                slideHeight={slideHeight}
                data={data}
            />
    
}

class CarouselComponent extends Component {

    constructor (props) {
        super(props);
        this.sliderAuto;
        this.testimonialSection = React.createRef();
        this.state={ 
                      slideNum:0,
                      translateX:0,
                      slideLeftArr:[],
                      deviceCss:'',
                      width:0,
                      height:0,
                      carouselSectionWidth:0,
                      carouselSectionHeight:0,
                      carouselSlideWidth:0,
                      carouselSlideHeight:0,
                      translateXby:0,
                      slidesLength:0,
                      toggleAutoSlide:true
                  };
    }
    componentDidMount(){
        const sectionWidth = this.testimonialSection.current.getBoundingClientRect().width;
        const slidesLen  = this.props.component.data.length;
        const desktopWidth = slidesLen * ( this.props.desktopWidthHeight.width + 24);

        const newslideLeftArr=[];
        let cssClass="mobile__css";
        let carouselSectionWidth;
        let carouselSectionHeight;
        let carouselSlideWidth;
        let carouselSlideHeight;
        let translateXby;
        if(sectionWidth > desktopWidth){

            cssClass="desktop__css";
            carouselSectionWidth="100%";
            carouselSectionHeight=this.props.desktopWidthHeight.height+'px';
            carouselSlideHeight=this.props.desktopWidthHeight.height+'px';
            carouselSlideWidth=this.props.desktopWidthHeight.width+'px';


        }
        else if(sectionWidth > 600){

            carouselSectionWidth= this.props.desktopWidthHeight.width+this.props.arrowsButtons.width+'px';
            carouselSectionHeight=this.props.desktopWidthHeight.height+'px';
            translateXby=this.props.desktopWidthHeight.width;
            carouselSlideHeight=this.props.desktopWidthHeight.height+'px';
            carouselSlideWidth=this.props.desktopWidthHeight.width+'px';
            for(let i=0;i<slidesLen;i++){
                newslideLeftArr[i]=this.props.desktopWidthHeight.width*i;
            }
           
        }
        else {
            carouselSectionWidth= this.props.mobileWidthHeight.width+this.props.arrowsButtons.width+'px';
            carouselSectionHeight=this.props.mobileWidthHeight.height+'px';
            translateXby=this.props.mobileWidthHeight.width;
            carouselSlideHeight=this.props.mobileWidthHeight.height+'px';
            carouselSlideWidth=this.props.mobileWidthHeight.width+'px';
            for(let i=0;i<slidesLen;i++){
                newslideLeftArr[i]=this.props.mobileWidthHeight.width*i;
            }
        }
        this.addAutoSlide();
        this.setState({
            mounted:true,
            slideLeftArr:newslideLeftArr,
            carouselSectionWidth,
            carouselSectionHeight,
            carouselSlideWidth,
            carouselSlideHeight,
            deviceCss:cssClass,
            translateXby,
            slidesLength:slidesLen
        });
    }
    leftButtonClick = () =>{
       
        if(this.state.slideNum<this.state.slidesLength-1){
            this.setState({ translateX:this.state.translateX-this.state.translateXby,slideNum:this.state.slideNum+1});

            if(this.state.toggleAutoSlide)
                this.addAutoSlide();

        }
    }
    rightButtonClick = () =>{
        if(this.state.slideNum>0){

            this.setState({ translateX:this.state.translateX+this.state.translateXby,slideNum:this.state.slideNum-1});
            
            if(this.state.toggleAutoSlide)
                this.addAutoSlide();
        }
       
    }
    touchStart = () =>{
            if(this.sliderAuto){
                clearInterval(this.sliderAuto);
                this.sliderAuto=undefined;
            }
    }
    addAutoSlide = () =>{
        if(this.sliderAuto){
            clearInterval(this.sliderAuto);
            this.sliderAuto=undefined;
        }
        this.sliderAuto = setInterval(this.slideAutomatically,this.props.autoSlideIntervalInSeconds*1000);      
    }
    toggleAutSlide = () =>{
        if(!this.state.toggleAutoSlide){
            this.addAutoSlide();
        }
        else{
            clearInterval(this.sliderAuto);
            this.sliderAuto=undefined;
        }
        this.setState({toggleAutoSlide:!this.state.toggleAutoSlide});
       
    }

    slideAutomatically = () =>{
            if(this.state.slideNum === this.state.slidesLength-1)
                this.setState({ translateX:this.state.translateX+(this.state.slidesLength-1) * this.state.translateXby,slideNum:0});
            else
                this.setState({ translateX:this.state.translateX-this.state.translateXby,slideNum:this.state.slideNum+1});
    }

    render() {
        if(!this.state.mounted)
        return  <section ref={this.testimonialSection} className="carousel_shimmer"></section>;
        return (
            <div className="carousel__section">
                <h2 className="section-header section-header--large header__margin">{this.props.header}</h2>
                {this.props.OfferPara &&(
                    <div className="offer__content_wrapper">
                        <p className="para__content">{getHTML(this.props.OfferPara.para)}</p>
                    </div>
                )}
                <div 
                    className={`carousel ${this.state.deviceCss}`} style={{width:this.state.carouselSectionWidth,height:this.state.carouselSectionHeight}}
                >
                    <div onClick={this.toggleAutSlide} className="carousel_images__wrapper" style={{width:this.state.carouselSlideWidth,height:this.state.carouselSlideHeight}}>
                            
                            {
                                componentLookUp(
                                                this.props.component.name,
                                                this.state.slideLeftArr,
                                                this.state.translateX,
                                                this.state.carouselSlideWidth,
                                                this.state.carouselSlideHeight,
                                                this.props.component.data
                                            )
                            }
                          
                    </div>
                    { this.state.deviceCss==="mobile__css" && (
                        <div 
                            onClick={this.toggleAutSlide}
                            className="onClick_event" 
                            style={
                                    {
                                        width:this.state.translateXby-this.props.arrowsButtons.width+'px' ,
                                        left:this.props.arrowsButtons.width,
                                        right:this.props.arrowsButtons.width,
                                        height:this.state.carouselSectionHeight
                                    }
                                }
                        >
                          <div >
                         </div>            
                        </div>
                    )}         
                    <div className="arrow__keys" style={{width:this.state.carouselSectionWidth,height:this.state.carouselSectionHeight}}>
                        <img  className={`keys_css ${this.state.slideNum==0 ? 'display__none' :''}`} src={this.props.arrowsButtons.leftArrowImg} alt="left key"  onClick = {this.rightButtonClick} />
                        <img className={`keys_css ${this.state.slideNum==this.state.slidesLength-1 ? 'display__none' :''}`}  src={this.props.arrowsButtons.rightArrowImg} alt="right key" onClick ={this.leftButtonClick}/>
                    </div>
                   
                    
                </div>
                
            </div>
        );
    }
}

export default CarouselComponent;