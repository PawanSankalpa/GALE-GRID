import React from 'react';
import './styles/Pricing.css';

import Aos from "aos";
import "aos/dist/aos.css";

const packages = [
  {
    name: 'Micro',
    price: '$300',
    pages: '1 Page',
    features: ['Pretty design', 'Google-friendly', 'Safe site'],
  },
  {
    name: 'Starter',
    price: '$800',
    pages: '3 Pages',
    features: ['Nice design with animations', 'Better Google boost', 'Simple features like forms'],
  },
  {
    name: 'Growth',
    price: '$1,800',
    pages: '7 Pages',
    features: ['Fancy designs', 'Cool features like stores', 'Data charts'],
  },
];

const Pricing = () => {
  return (
    <section className="gale-home-container" aria-labelledby="packages-title" data-aos="zoom-in-up">
      <h1 id="packages-title" className="gale-home-title">
        Our Packages
      </h1>
      <p className="gale-home-subtitle">
        Affordable, modern websites to get your business online fast!
      </p>

      <div className="gale-home-packages-grid">
        {packages.map((pkg, index) => (
          <article key={index} className="gale-home-package-card" aria-label={`${pkg.name} package`}>
            <h2 className="gale-home-package-name">{pkg.name}</h2>
            <p className="gale-home-package-price" aria-label={`Price: ${pkg.price}`}>
              {pkg.price}
            </p>
            <p className="gale-home-package-pages" aria-label={`Pages included: ${pkg.pages}`}>
              {pkg.pages}
            </p>
            <ul className="gale-home-package-features" aria-label={`${pkg.name} features`}>
              {pkg.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            {/* Uncomment if you want an explore link */}
            {/* <a href="/pricing" className="gale-home-explore-button" aria-label={`Explore more about the ${pkg.name} package`}>
              Explore More
            </a> */}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
