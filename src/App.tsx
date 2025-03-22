import React from 'react';
import {Routes, Route, Link} from 'react-router-dom';
import ConstElemHTML from './elementHTML/const_elemHTML';
import HomePage from './elementHTML/home_page';
import WorkZona from './elementHTML/work_zona';
import Presents from './elementHTML/presents';
function App() {
  return (
    <div className='body'>
      <Routes>
          <Route path='/' element={<ConstElemHTML/>}>
            <Route index element={<HomePage/>}/>
            <Route path='/work' element={<WorkZona/>}/>
            <Route path='/prezents' element={<Presents/>}/>
          </Route>
      </Routes>
    </div>
    
  );
}

export default App;
