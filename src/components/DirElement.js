import {ReactComponent as FolderIco } from '../assets/images/folder-ico.svg';
import {ReactComponent as FilmIco } from '../assets/images/film-ico.svg';
import {ReactComponent as BackFolder } from '../assets/images/back-folder.svg';

import { Focusable } from 'react-js-spatial-navigation'

import '../styles/ItemFolder.css';

const Component = ({ type }) => {
    if ( type === 'folder' ) {
        return <FolderIco height={149} width={180}/>
    } else if ( type === 'file' ) {
        return <FilmIco height={149} width={180}/>
    } else {
        return <h3> unknown </h3>
    }
}

const checkStep = ({item, step, back}) => {
    if( item.type === 'control' ) {     
        back();
    } else {
        step(item);
    }
}

const catItemName = (name) => {
    // console.log(`${name} ---> ${name.length}`);
    // if ( name.length > 50 ) {
    //     return name.substring(0,40)+'...';
    // }

    return name;
}

const DirElement = ({index, item, step, back}) => {
    if ( item.type === 'control' ) {
        return (
            <Focusable className="FOLDER-container" onClickEnter={() => checkStep({item, step, back})}>    
                <div key={index} onClick={() => checkStep({item, step, back})}>
                    <div className="ICO-folder-container"> 
                        <BackFolder height={149} width={180}/>
                    </div>

                    <div className="NAME-folder-container">
                        <p className="NAME-folder-text"> {item.name} </p>
                    </div>

                </div>
            </Focusable>
        )
    } else if ( item.type === 'null' ) {
        return (
            <div className="NULL-container"> </div>
        )
    } else {
        return (
            <Focusable className="FOLDER-container" onClickEnter={() => checkStep({item, step, back})}>    
                <div key={index} onClick={() => checkStep({item, step, back})}>
                    <div className="ICO-folder-container"> 
                        <Component type={item.type} />
                    </div>
                    
                    <div className="NAME-folder-container">
                        <p className="NAME-folder-text"> {catItemName(item.name)} </p>
                    </div>
                </div>
            </Focusable>
        )
    }    
}

export { DirElement };