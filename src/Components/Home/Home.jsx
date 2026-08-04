import React from "react";
import Style from './Home.module.css';
import Heading from "../Home Sections/Home Heading/Heading";
import Chart from "../Home Sections/Home Trading Chart/Chart";
import Questions from "../Home Sections/Home Questions/Questions";
import Feedback from "../Home Sections/Home Feedback/Feedback";
import Prices from "../Home Sections/Home Prices/Prices";
import Library from "../../Pages/Library/Library";
export default function Home(){    
    return (
        <>
            <Heading/>
            <Chart/>
            <Library/>
            <Prices/>
            <Questions/>
            <Feedback/>        
        </>
    );
}