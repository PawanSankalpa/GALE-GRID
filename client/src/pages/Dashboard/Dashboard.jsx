import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import NavBar from "../../components/NavBar";

function Dashboard(){

    const navigate = useNavigate();

    function goToHomePage(){
        navigate("/")
    }
    return(
        <>
            <NavBar />
            <div className="dashboard-container">

                <h1>still working on it</h1>
                <div className="workingOnItImg">
                    <img src="/images/workingOnIt.jpg" alt="working on it img" />
                </div>
                <button className="gobackButton" onClick={goToHomePage}>go back to the home page</button>

            </div>
        </>
    )
}

export default Dashboard;