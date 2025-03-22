import React from 'react';
import {NavLink} from 'react-router-dom';
function HeaderNav(){
    return(
        <div className='header'>
            <div className="header__navigation">
                <ul>
                    <p className="logohn">PRESE</p>
                    <li> <NavLink className={({isActive}) => isActive ? 'header_button_active header_button' : 'header_button'} to='/'>Главная</NavLink> </li>
                    <li> <NavLink className={({isActive}) => isActive ? 'header_button_active header_button' : 'header_button'} to='/work'>Рабочая Зона</NavLink></li>
                    <li> <NavLink className={({isActive}) => isActive ? 'header_button_active header_button' : 'header_button'} to='/prezents'>Ваши Презентации</NavLink> </li>
                </ul>
                <button className="btn" >Зарегистрироваться</button>
            </div>
        </div>
        
    );
}
export default HeaderNav;