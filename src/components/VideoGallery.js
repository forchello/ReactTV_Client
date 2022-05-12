import React, { useState, useEffect, useRef } from 'react'

// ------- STYLES 

import '../styles/Player.css';

// ------- IMAGES

import {ReactComponent as BackImage } from '../assets/images/back-video.svg';

import {ReactComponent as NextIco } from '../assets/images/video-controls/next-sec.svg';
import {ReactComponent as PrevIco } from '../assets/images/video-controls/prev-sec.svg';
import {ReactComponent as PauseIco } from '../assets/images/video-controls/pause.svg';
import {ReactComponent as PlayIco } from '../assets/images/video-controls/play.svg';

// ------- LIBS

import ReactPlayer from 'react-player';
import { Focusable, FocusableSection } from 'react-js-spatial-navigation'

// -------

const VideoGallery = ({videoName, back}) => {


  const [focusSeek, setFocusSeek] = useState(0);

  const [isVideoPlay, setIsVideoPlay ] = useState(false);
  
  const [showElement, setShowElement] = React.useState(true);
  const [timeForDelay, setTimeForDelay] = useState(5000);

  const Player = useRef();
  const InputRange = useRef();

  useEffect(() => {
    const delayDebounceFn = setTimeout(function () {
      setShowElement(false);
    }, timeForDelay);

    return () => clearTimeout(delayDebounceFn); 
  }, [isVideoPlay, timeForDelay]);

  const filmName = videoName.replace(/\.[^/.]+$/, '');
  const link = 'http://192.168.0.135:3000/api/getMovies?name=' + filmName;


  const VideoStatusIco = () => {
    if ( isVideoPlay ) {
      return <PauseIco height={30} width={30}/> 
    } else {
      return <PlayIco height={29} width={30}/> 
    }
  }

  const [totalVideoTime, setTotalVideoTime] = useState(0);
  const [currentSeek, setCurrentSeek] = useState(0);

  const handleSeekChange = (e) => {
    console.log(e.target);

    setFocusSeek(true);

    setCurrentSeek(e.target.value);
    Player.current.seekTo(e.target.value);
  }

  const handlePlay = () => {
    if ( totalVideoTime === 0 ) {
      console.log(Player.current.getDuration());
      setTotalVideoTime(Player.current.getDuration());
    }

    setIsVideoPlay(true);
  }

  const handlePause = () => {
    setIsVideoPlay(false);
  }

  const prev10sec = () => {
    Player.current.seekTo(currentSeek - 10);
    setCurrentSeek(currentSeek - 10);
  }

  const next10sec = () => {
    Player.current.seekTo(currentSeek + 10);
    setCurrentSeek(currentSeek + 10);
  }

  // ---------

  return (
    <FocusableSection enterTo={'player-wrapper'}>
      <div onClick={() => {
          setShowElement(true);

          if ( isVideoPlay ) {
            handlePause();
          } else {
            handlePlay();
          }
      }}>
      <div className="player-wrapper" onClick={() => {
        setShowElement(true);        
        }}>
        <ReactPlayer 
          id = 'react-player'
          className='react-player'
          url = {link}
          width='100%'
          height='100%'
          playing={isVideoPlay}

          ref={Player}

          onProgress={(e) => {
            setCurrentSeek(e.playedSeconds);
            // console.log(currentSeek);
          }}

          onReady={() => handlePlay()}
          onSeek={e => console.log('onSeek', e)}
        />
      </div>
      </div>

      { showElement ? (
        <div>
        <div className="video-header-container"> 
          <Focusable className="video-header-back_button" onClickEnter={() => back()}>
            <BackImage height={28} width={28}/> 
          </Focusable>

          <div className="video-header-name">
            <h3> {filmName} </h3> 
          </div>

          <div className="video-header-NONAME-button" />

        </div>
        

        <div className="video-controls-container">
          <Focusable
            className="video-controls-timeline" 
          >
            <input 
              id="input-range"
              ref = {InputRange}
              className="video-controls-timeline-range" 
              type="range" 
              min={0} 
              max={totalVideoTime}
              value={currentSeek}
              step='3'
              onClick={(e) => handleSeekChange(e)}
              // onChange={(e) => handleSeekChange(e)}
              onChange={() => setFocusSeek(true)}
            />
          </Focusable>
          
          <div className="video-controls-buttons-container"> 

            <Focusable className="video-controls-prev-10sec" onClickEnter={() => prev10sec()}>
              <PrevIco height={40} width={51}/> 
            </Focusable>

            <Focusable className="video-controls-pause" onClickEnter={() => {isVideoPlay ? handlePause() : handlePlay()}}>
              <div onClick={() => {isVideoPlay ? handlePause() : handlePlay()}}>
                <VideoStatusIco />   
              </div>      
            </Focusable> 

            <Focusable className="video-controls-next-10sec" onClickEnter={() => next10sec()}>
              <NextIco height={40} width={51}/> 
            </Focusable>

            <div className="video-controls-empty-space" />

            <div className="video-controls-NONAME-BUTTON"/>

          </div>
        </div>
        </div>
      ) : <></>}
      
    </FocusableSection>
  )
} 

export { VideoGallery };