import React from "react";
import "./OurWork.css";
import NavBar from "../../components/NavBar";

const Project = ({ title, description, image, siteUrl }) => (
    <div className="ourWorks-projectCard-container">
        <h3 className="ourWorks-project-title">{title}</h3>
        <p className="ourWorks-project-description">{description}</p>
        <img src={image} alt={title} className="ourWorks-project-img" />
        <a className="ourWork-visitSite-button" href={siteUrl} target="_blank" rel="noopener noreferrer">Visit Site</a>
    </div>
);

function OurWork() {
    const projects = [
        {
            title: "Ray Energy Solar",
            description: "A modern, responsive website for a solar energy business, built with React. Features include interactive buttons, smooth hover effects, and a user-friendly design optimized for all devices.",
            image: "images/solarHomePage.png",
            siteUrl: "https://ray-energy-solar.vercel.app/",
        },
        {
            title: "Connect & Post: Share Your Thoughts",
            description: "A simple platform to register, log in, and share your blog posts with a title and description. You can edit or delete your posts anytime from your private user page. Built with EJS and connected to a database to securely store users and their content.",
            image: "/images/blogHomePage.png",
            siteUrl: "https://blogproject-xm1p.onrender.com/",
        },
        {
            title: "School Website",
            description: "A full stack website with both backend and front end , still working on the website",
            image: "images/schoolWeb/HomePage.png",
            siteUrl: "https://school-website-azure-seven.vercel.app/",
        },
        {
            title: "Sanic College",
            description: "A website for a tuition class, still working on it.",
            image: "images/classWeb/HomePage.png",
            siteUrl: "https://ray-energy-solar.vercel.app/",
        },
        {
            title: "Travel Tracker",
            description: "A website where you can mark the countries you've visited on an interactive world map. Built with EJS, Express, and Node.js, and connected to a PostgreSQL database to securely store your travel history.",
            image: "images/travelTracker.png",
            siteUrl: "https://travel-tracker-z3kz.onrender.com/",
        },
        {
            title: "TO-DO List",
            description: "A simple to do list app created using react, only fornt end for now, but adding backend is easy.",
            image: "images/todoList.png",
            siteUrl: "https://todo-list-app-liard-alpha.vercel.app/",
        },
    ];

    return (
        <>
        <NavBar />
        <div className="ourWorkPage-container">
            <div className="ourwork-header-container">
                <h1>Our Work</h1>
                <p>You can watch our previous work here</p>
            </div>

            <div className="ourWork-cards-container">
                {projects.map((project, index) => (
                    <Project
                        key={index}
                        title={project.title}
                        description={project.description}
                        image={project.image}
                        siteUrl={project.siteUrl}
                    />
                ))}
            </div>
        </div>
        </>
    );
}

export default OurWork;