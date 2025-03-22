import React from "react";
import {Outlet} from 'react-router-dom';
import HeaderNav from "./header_nav";
import Footer from "./footer";
function ConstElemHTML(){
    return(
    <div>
        <HeaderNav/>
        <Outlet/>        
        <Footer/>
    </div>)
}
export default ConstElemHTML;