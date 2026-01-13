import React, { useState } from "react";
import "./styles/WhyUs.css";
import statsPic1 from "../assets/statsPics/sumup-xzoH6RjQS3E-unsplash.jpg";
import statsPic2 from "../assets/statsPics/zac-wolff-q5tQtPZ7j2k-unsplash.jpg";
import statsPic3 from "../assets/statsPics/daniel-korpai-pKRNxEguRgM-unsplash.jpg";

const whyUsSteps = [
	{
		number: "01.",
		title: "Beat Your Competitors",
		desc: "We build websites that help your business stand out. Trusted by 10+ growing businesses.",
		img: statsPic1,
	},
	{
		number: "02.",
		title: "Easy, Fast, and Useful",
		desc: "Simple websites that load fast and are easy to use, leading to higher engagement.",
		img: statsPic2,
	},
	{
		number: "03.",
		title: "Rank Higher on Google",
		desc: "We build with SEO in mind so your site is easier to find on Google.",
		img: statsPic3,
	},
];

export default function WhyUs() {
	const [activeStep, setActiveStep] = useState(0);

	return (
		<section className="whyus-section" aria-labelledby="whyus-title">
			<div className="whyus-shell">
				<div className="whyus-img-col">
					<img
						src={whyUsSteps[activeStep].img}
						alt="Step visual"
						className="whyus-main-img whyus-main-img-animate"
					/>
				</div>
				<div className="whyus-content-flex">
					<div className="whyus-content-main">
						<div className="whyus-eyebrow">- WHY US -</div>
						<h2 className="whyus-title" id="whyus-title">
							How Your Website Helps Your Business Grow
						</h2>
						<div className="whyus-steps">
							{whyUsSteps.map((step, idx) => (
								<div
									className="whyus-step"
									key={step.title}
									onMouseEnter={() => setActiveStep(idx)}
									onFocus={() => setActiveStep(idx)}
									tabIndex={0}
								>
									<div
										className={`whyus-step-num whyus-step-num-${
											idx + 1
										}`}
									>
										{step.number}
									</div>
									<div className="whyus-step-content">
										<div className="whyus-step-title">{step.title}</div>
										<div className="whyus-step-desc">{step.desc}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
