import React from 'react';
import {NavLink} from 'react-router-dom';
function HeaderNav(){
    return(
        <div className='header'>
            <div className="header__navigation">
                <p className="logohn">PRESE</p>
                <ul>
                    <li> <NavLink className={({isActive}) => isActive ? 'header_button_active header_button' : 'header_button'} to='/'>Главная</NavLink> </li>
                    <li> <NavLink className={({isActive}) => isActive ? 'header_button_active header_button' : 'header_button'} to='/work'>Ваши Презентации</NavLink></li>
                    <li> <NavLink className={({isActive}) => isActive ? 'header_button_active header_button' : 'header_button'} to='/prezents'>Рабочая Зона</NavLink> </li>
                </ul>
            </div>
        </div>
        
    );
}
export default HeaderNav;