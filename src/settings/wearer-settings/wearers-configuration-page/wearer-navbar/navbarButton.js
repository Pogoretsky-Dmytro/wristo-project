import React from 'react';
import classNames from 'classnames';
//import wearerLogo from '../../assets/icons/default_avatar.png';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';


class NavbarButton extends React.Component{ 


 render(){
        return (
            
                <button className="addWearerButton" onClick={()=>{this.props.handleAddWearerButton(); this.props.handleAddWearerButtonClicked()}} >
                    <svg className="addWearerButton__icon" fill="#B52F54" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      <path d="M0 0h24v24H0z" fill="none"/>
                    </svg>
                    <span className="addWearerButton__name">Add Wearer</span>
                </button>
        );
    }
}



export default NavbarButton;