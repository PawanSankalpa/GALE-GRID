import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import './styles/NavBar.css';


const NavBar = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	const hamburgerRef = useRef(null);
	const mobileNavRef = useRef(null);

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === 'Escape') setMenuOpen(false);
		};

		if (menuOpen) {
			document.addEventListener('keydown', onKey);
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			if (scrollbarWidth > 0) {
				document.body.style.paddingRight = `${scrollbarWidth}px`;
			}
			document.body.style.overflow = 'hidden';
			setTimeout(() => {
				const first = mobileNavRef.current && mobileNavRef.current.querySelector('a');
				if (first) first.focus();
			}, 0);
		} else {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
			if (hamburgerRef.current) hamburgerRef.current.focus();
		}

		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		};
	}, [menuOpen]);

	useEffect(() => {
		const closeIfDesktop = () => {
			if (window.innerWidth > 768 && menuOpen) {
				setMenuOpen(false);
			}
		};

		closeIfDesktop();
		window.addEventListener('resize', closeIfDesktop);
		return () => window.removeEventListener('resize', closeIfDesktop);
	}, [menuOpen]);

	return (
		<nav className="navbar sticky">
			<Link to="/" style={{ color: 'var(--navbar-text-primary)', textDecoration: 'none' }}><div className="logo">GAlE GRID</div></Link>

			{/* Desktop Nav */}
			<div className="nav-links desktop-only">
				<Link to="/">Home</Link>
				<Link to="/services">Services</Link>
				<Link to="/pricing">Pricing</Link>
				<Link to="/ourWork">Work</Link>
				<Link to="/plan">Plan</Link>
				<Link to="/contact" className="nav-cta">Let's Talk</Link>
			</div>

			<button
				ref={hamburgerRef}
				className={`hamburger mobile-only ${menuOpen ? 'open' : ''}`}
				aria-expanded={menuOpen}
				aria-controls="mobileNav"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				onClick={() => setMenuOpen(prev => !prev)}
			>
				<span />
				<span />
				<span />
			</button>

			{/* Mobile Drawer */}
			<div
				id="mobileNav"
				ref={mobileNavRef}
				className={`mobile-drawer ${menuOpen ? 'open' : ''}`}
				aria-hidden={!menuOpen}
				role="dialog"
			>
				<div className="drawer-header">
					<div className="logo">GG</div>
					<button
						className="mobile-close"
						onClick={() => setMenuOpen(false)}
						aria-label="Close menu"
					>
						×
					</button>
				</div>

				<nav className="drawer-nav">
					<ul>
						<li><a href="#services" onClick={() => setMenuOpen(false)}>Home</a></li>
						<li><a href="#services" onClick={() => setMenuOpen(false)}>About</a></li>

						<li>
							<details className="drawer-submenu">
								<summary>Services</summary>
								<ul>
									<li><a href="#web" onClick={() => setMenuOpen(false)}>Web Design</a></li>
									<li><a href="#ecom" onClick={() => setMenuOpen(false)}>E-commerce</a></li>
									<li><a href="#branding" onClick={() => setMenuOpen(false)}>Branding</a></li>
								</ul>
							</details>
						</li>

						<li><a href="#services" onClick={() => setMenuOpen(false)}>Projects</a></li>
						<li><a href="#portfolio" onClick={() => setMenuOpen(false)}>Team</a></li>
						<li><a href="#portfolio" onClick={() => setMenuOpen(false)}>Reviews</a></li>

						{/* Pricing route in mobile */}
						<li>
							<Link to="/pricing" onClick={() => setMenuOpen(false)}>
								Pricing
							</Link>
						</li>

						<li>
							<a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>
								Let's Talk
							</a>
						</li>
					</ul>
				</nav>
			</div>

			<div
				className={`drawer-backdrop ${menuOpen ? 'open' : ''}`}
				onClick={() => setMenuOpen(false)}
				aria-hidden={!menuOpen}
			/>
		</nav>
	);
};

export default NavBar;
//         <li>
//           <NavLink to="/dashboard" onClick={closeMenu}>
//             Dashboard
//           </NavLink>
//         </li>
//       </ul>

//       <div className="ThemeToggle">
//         <ThemeToggle />
//       </div>

//       {/* <div className="login-register-box">
//         {loggedIn ? (
//           <div className="nav-logged-in">
//             <div className="nav-loading-placeholder" />
//             <span className="nav-welcome">Welcome, {username}!</span>
//             <button onClick={handleLogout} className="nav-logout">
//               Log out
//             </button>
//           </div>
//         ) : (
//           <>
//             <NavLink to="/login" className="nav-login" onClick={closeMenu}>
//               Log in
//             </NavLink>
//             <NavLink
//               to="/register"
//               className="nav-register"
//               onClick={closeMenu}
//             >
//               Register
//             </NavLink>
//           </>
//         )}
//       </div> */}
//     </nav>
//   );
// }

// export default NavBar;
