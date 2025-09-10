import React from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import AnimationStyles from 'react-awesome-slider/src/styled/fold-out-animation/fold-out-animation.scss';
import CoreStyles from 'react-awesome-slider/src/core/styles.scss';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import image1 from '../../../../../sources/Slider/arte1.png'
import image2 from "../../../../../sources/Slider/arte2.png"
import image3 from "../../../../../sources/Slider/arte3.png"
import image4 from "../../../../../sources/Slider/arte4.png"
import './index.css'

const AutoplaySlider = withAutoplay(AwesomeSlider);


const Slider = () => {
    return (
        <main className="Slider">
            <AutoplaySlider
            play={true} // Ativa o autoplay
            cancelOnInteraction={false} // Mantém o autoplay mesmo após interações
            interval={3000} // Tempo em milissegundos entre as transições
            animation="foldOutAnimation"
            cssModule={[CoreStyles, AnimationStyles]}
            >
            <div data-src={image1} />
            <div data-src={image2} />
            <div data-src={image3} />
            <div data-src={image4}/>
            
            </AutoplaySlider>
        </main>
      );
};

export default Slider;
