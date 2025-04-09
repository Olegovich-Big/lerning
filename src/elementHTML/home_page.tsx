import React from 'react';
import {Link} from 'react-router-dom';

function HomePage() {
    return(
        <div className='HomePage'>
            <div className='HomePage_content'>
                <div className='HomePage_text'>
                    <h1>Бесплатная программа
                для создания презентаций</h1>
                    <p>Воплощайте свои идеи в 
презентации, используя простое онлайн-приложение.</p>
                    <Link className="btn" to='/work'>Создать презентацию</Link>
                </div>
                
                <img src={require('../image/popa.png')} className='HomePage_img' alt="Презентация"/>
            </div>
        </div>
    );
}
export default HomePage;