import { useState, useEffect, useRef } from 'react';

// -------- STYLES

import './styles/App.css';
import './styles/Header.css';
import './styles/ItemFolder.css';

// -------- FONTS

import './styles/Fonts.css';

// -------- IMAGES

import {ReactComponent as BurgerIco } from './assets/images/burger.svg';
import {ReactComponent as ProfileIco } from './assets/images/profile.svg';

import {ReactComponent as BurgerFocusIco } from './assets/images/burger-focus.svg';
import {ReactComponent as ProfileFocusIco } from './assets/images/profile-focus.svg';

// -------- COMPONENTS

import { DirElement } from './components/DirElement.js';
import { VideoGallery } from './components/VideoGallery.js';
// -------- LIBS

import SpatialNavigation, { Focusable, FocusableSection } from 'react-js-spatial-navigation'

// -------------

const App = () => {
  
  const FetchToStep = async () => {
    try {
      const api = 'http://localhost:3000/api/getMovies?path=' + currentPath;
      const responce = await fetch ( api, { 
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = JSON.parse(await responce.text()).data
      console.log(data)

      const folder_data = data.filter( value => {
        return value.type === 'folder'
      })

      const film_data = data.filter( value => {
        return value.type === 'file'
      })

      data.sort((a,b) => {
        if ( a.name > b.name ) {
          return -1
        } else if ( a.name < b.name ) {
          return 1;
        } else {
          return 0;
        }
      })

      folder_data.sort(value => {
        if ( value.type === 'folder' ) {
          return 1;
        } else if ( value.type === 'file' ) {
          return -1;
        } else {
          return 0;
        }
      })

      if ( currentPath !== '/' ) {
        const control_element = {
          name: currentPath,
          type: 'control',
        }
        
        const data_with_control = [control_element].concat(folder_data).concat(film_data);

        console.log(data_with_control);
        if ( data_with_control.length % 4 !== 0 ) {
          const null_element = {
            name: '',
            type: 'null',
          }
          
          const add_null_length = 4 - ( data_with_control.length % 4 );

          console.log(add_null_length);

          for ( let i = 0; i < add_null_length; i++ ) {
            data_with_control.push(null_element);
          }

          setDirs(data_with_control);
        }

        setDirs(data_with_control);
      } else {
        if ( data.length % 4 !== 0 ) {
          const null_element = {
            name: '',
            type: 'null',
          }
          
          const add_null_length = 4 - ( data.length % 4 );

          console.log(add_null_length);

          for ( let i = 0; i < add_null_length; i++ ) {
            data.push(null_element);
          }

          setDirs(data);
        } else {
          setDirs(data);
        }
        
      }
      
    } catch (e) {
      console.log(e);
    }
  };

  const [currentPath, setCurrentPath] = useState('/');
  const [videoIsPlay, setVideoIsPlay] = useState(false);
  const [videoName, setVideoName] = useState('');
  const [dirs, setDirs] = useState([]);


  const [defaultElement, setDefaultElement] = useState('button');

  useEffect(() => {
    if ( currentPath === '/' ) {
      setDefaultElement('button');
    } else {
      setDefaultElement('folder');
    }

    if ( currentPath.match(RegExp(`.+.${currentPath.split('.').pop()}`) ) ) {
      setVideoIsPlay(true);
    } else {
      const delayDebounceFn = setTimeout(() => {
        FetchToStep(currentPath);
      }, 0);
  
      return () => clearTimeout(delayDebounceFn);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath]);
  
  const Step = async (item) => {
    setVideoName(item.name);

    let substring = '/'
    
    if ( item.type === 'file' ) {
      substring = ''
    } 
    
    const newPath = currentPath + item.name + substring;
    setCurrentPath(newPath);
  };

  const Back = async () => {
    
    if ( videoIsPlay ) {
      setVideoIsPlay(false)
    }

    const array = currentPath.split('/');

    array.shift();
    array.splice(array.indexOf(array.pop()), 1);

    const result = `/${ array.join('/')}/`;

    if ( result === '//' ) {
      setCurrentPath('/');
    } else {
      setCurrentPath(result);     
    }
  }

  const closeFilm = () => {
    setVideoIsPlay(false);
  }

  const MainHeader = () => {
    return (
      <FocusableSection defaultElement={'header-burger-button'} enterTo={'header-burger-button'}>
        <div className="header-container">

          <Focusable className="header-burger-button">
            <div> <BurgerIco height={48} width={36}/> </div>
          </Focusable>
          
          <div className="header-switcher"> 

            <Focusable className="header-switch-detail" onClickEnter={() => FetchToStep()}>
            <div> 
              <h3> Каталог </h3> 
            </div>
            </Focusable>

            <Focusable className="header-switch-detail">
            <div> 
              <h3> Меню </h3>  
            </div>
            </Focusable>

            <Focusable className="header-switch-detail">
            <div onClick={()=> {console.log('test')}}>
              <h3> Поиск </h3>  
            </div>
            </Focusable>

          </div>
          
          <Focusable className="header-profile-button"> 
   
            <ProfileIco height={38} width={57} /> 

          </Focusable>
        </div>
      </FocusableSection>
    )
  }

  const MainBody = () => {
    if ( !videoIsPlay ) {
      return (
        <div className="App">
          <MainHeader />
          <div className="item-container">
            {dirs.map((item, index) => (
              <DirElement key={index} item={item} step={Step} back={Back} />
            ))}
          </div>
        </div>
      )
    } else {
      return (
        <VideoGallery videoName={videoName} back={closeFilm}/>
      )
    }   
  }

  return (
    <SpatialNavigation>

      <MainBody/>
          
    </SpatialNavigation>
  );
};

export default App;
