import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './OurWork.css';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import CTA from '../../components/CTA';
import { lockBodyScroll } from '../../utils/scrollLock';
import {
  ArrowRight, ArrowDown, Check, X, Target,
  TrendingUp, Globe, BarChart2, Code2, Palette,
  ChevronLeft, ChevronRight
} from 'lucide-react';

/* ─────────────────────────────────────────
   ASSETS
───────────────────────────────────────── */
import luxiaScreenshot from '../../assets/OurWork/screencapture-luxia-clothing-vercel-app-2026-01-16-19_39_34.png';
import sunmaxScreenshot from '../../assets/OurWork/screencapture-sunmaxenergy-lk-2026-01-16-19_36_25.png';
import galegridScreenshot from '../../assets/OurWork/screencapture-galegrid-2026-01-16-19_40_58.png';
import luxiaBefore from '../../assets/OurWork/Screenshot 2026-01-16 at 19.41.52.png';
import luxiaAfter from '../../assets/OurWork/screencapture-luxia-clothing-vercel-app-2026-01-16-19_39_34.png';
import sunmaxBefore from '../../assets/OurWork/Screenshot 2026-01-16 at 19.42.37.png';
import sunmaxAfter from '../../assets/OurWork/screencapture-sunmaxenergy-lk-2026-01-16-19_36_25.png';
import galegridBefore from '../../assets/OurWork/Screenshot 2026-01-16 at 19.43.45.png';
import galegridAfter from '../../assets/OurWork/screencapture-galegrid-2026-01-16-19_40_58.png';

// Portfolio Section Assets Imports
import hotelImg from '../../assets/portfolioPics/hotel11.png';
import operaImg from '../../assets/portfolioPics/luxia-item.png';
import emeraldImg from '../../assets/portfolioPics/hotel-full.png';
import lifecareImg from '../../assets/portfolioPics/lifecare.jpeg';
import reflectImgImport from '../../assets/portfolioPics/reflect.png';
import aurumImgImport from '../../assets/portfolioPics/AURUM.png';
import lostFoundImgImport from '../../assets/portfolioPics/lost and found.jpg';
import diaryImgImport from '../../assets/portfolioPics/Diary.jpeg';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const caseStudies = [
  {
    id: 1,
    title: 'Luxia Interiors',
    industry: 'Interior Design',
    type: 'Website Redesign',
    year: '2025',
    size: 'lg',
    isNew: false,
    problem: 'Outdated website failing to capture the luxury brand essence, resulting in 80% bounce rate and zero online leads.',
    image: luxiaScreenshot,
    beforeImage: luxiaBefore,
    afterImage: luxiaAfter,
    metricValue: '+340%',
    metricLabel: 'Lead Generation',
    color: '#3B82F6',
    tags: ['UX Design', 'Development', 'SEO'],
    category: 'design',
    problems: [
      "Website looked outdated and didn't reflect premium brand positioning",
      'No clear call-to-action leading to missed conversion opportunities',
      'Mobile experience was broken, losing 60% of potential clients',
      'Page load time over 8 seconds causing high abandonment',
    ],
    solutions: [
      'Redesigned with luxury-focused aesthetics and modern glass morphism',
      'Implemented strategic CTA placement based on heat map analysis',
      'Built mobile-first responsive design for seamless experience',
      'Optimized performance achieving sub-2-second load times',
    ],
    results: [
      { value: '+340%', label: 'Lead Generation' },
      { value: '2.1s', label: 'Load Time' },
      { value: '-65%', label: 'Bounce Rate' },
      { value: '+180%', label: 'Time on Site' },
    ],
    decisions: [
      'Chose subtle animations over flashy effects to maintain elegance',
      'Prioritized portfolio imagery over text-heavy descriptions',
      'Integrated booking system directly into homepage flow',
    ],
  },
  {
    id: 2,
    title: 'SunMax Solar',
    industry: 'Renewable Energy',
    type: 'Full Brand & Web',
    year: '2025',
    size: 'wide',
    isNew: false,
    problem: 'New solar company struggling to establish credibility in a competitive market with zero online presence.',
    image: sunmaxScreenshot,
    beforeImage: sunmaxBefore,
    afterImage: sunmaxAfter,
    metricValue: '+520%',
    metricLabel: 'Quote Requests',
    color: '#10B981',
    tags: ['Branding', 'Web Design', 'Marketing'],
    category: 'branding',
    problems: [
      'No established brand identity or market differentiation',
      'Competitors dominated search results for local solar queries',
      'No system to capture and nurture potential leads',
      'Complex pricing confused potential customers',
    ],
    solutions: [
      'Created distinctive brand identity emphasizing trust and innovation',
      'Developed SEO-optimized content strategy targeting local keywords',
      'Built automated lead capture with instant quote calculator',
      'Designed transparent pricing section with comparison tools',
    ],
    results: [
      { value: '+520%', label: 'Quote Requests' },
      { value: '#1', label: 'Local SEO Rank' },
      { value: '45%', label: 'Conversion Rate' },
      { value: '$2.4M', label: 'Revenue Year 1' },
    ],
    decisions: [
      'Chose green/orange colour palette to balance eco-friendly with energy',
      'Prioritized trust signals over aggressive sales messaging',
      'Built ROI calculator as primary conversion mechanism',
    ],
  },
  {
    id: 3,
    title: 'GaleGrid Tech',
    industry: 'SaaS',
    type: 'Product Landing',
    year: '2025',
    size: 'md',
    isNew: true,
    problem: 'Tech startup with powerful product but confusing messaging that failed to convert trial users.',
    image: galegridScreenshot,
    beforeImage: galegridBefore,
    afterImage: galegridAfter,
    metricValue: '+280%',
    metricLabel: 'Trial Sign-ups',
    color: '#8B5CF6',
    tags: ['UI/UX', 'Conversion', 'Development'],
    category: 'development',
    problems: [
      'Technical jargon alienated non-technical decision makers',
      'Trial sign-up process had 7 steps causing 90% drop-off',
      'No clear demonstration of product value proposition',
      'Pricing page confusion led to support ticket overload',
    ],
    solutions: [
      'Rewrote all copy focusing on benefits, not features',
      'Reduced sign-up to 2 steps with progressive disclosure',
      'Created interactive product demo embedded in homepage',
      'Redesigned pricing with clear tier comparisons',
    ],
    results: [
      { value: '+280%', label: 'Trial Sign-ups' },
      { value: '+150%', label: 'Paid Conversions' },
      { value: '-70%', label: 'Support Tickets' },
      { value: '4.8\u2605', label: 'User Rating' },
    ],
    decisions: [
      'Chose conversational tone over corporate speak',
      'Prioritized interactive demo over static screenshots',
      'Added comparison section addressing competitor concerns',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // PROJECTS 4 – 10  →  Add your screenshots when ready
  //
  // HOW TO ADD A SCREENSHOT:
  //   1. Drop your image in:  src/assets/OurWork/your-file.png
  //   2. Import it at the top of this file:
  //        import aceroScreenshot from '../../assets/OurWork/your-file.png';
  //   3. Replace  image: null  with  image: aceroScreenshot
  //      Do the same for beforeImage / afterImage if you have them.
  //
  // The card will show a colour gradient until you add a real image.
  // ─────────────────────────────────────────────────────────────────

  {
    id: 4,
    title: 'Acero Restaurant',
    industry: 'Hospitality',
    type: 'Brand & Website',
    year: '2025',
    size: 'sm',
    isNew: false,
    // ↓ Replace null with your imported screenshot when ready
    image: null,
    beforeImage: null,
    afterImage: null,
    metricValue: '+210%',
    metricLabel: 'Reservations',
    color: '#F59E0B',
    tags: ['Branding', 'Web Design', 'Photography'],
    category: 'branding',
    problem: 'Upscale restaurant losing walk-ins to competitors due to an outdated website with no online booking system.',
    problems: [
      'No online reservation system, causing phone-only bookings and missed revenue',
      'Website photography was low quality and did not reflect the dining experience',
      'Menu was a scanned PDF — unusable on mobile devices',
      'No Google My Business strategy despite being in a high-foot-traffic area',
    ],
    solutions: [
      'Integrated live booking widget directly on the homepage above the fold',
      'Organised a professional food photography shoot and built an immersive gallery',
      'Built an interactive digital menu with allergen filters',
      'Optimised local SEO and GMB profile to capture nearby search intent',
    ],
    results: [
      { value: '+210%', label: 'Reservations' },
      { value: '+85%',  label: 'Avg. Spend' },
      { value: '4.9★',  label: 'Google Rating' },
      { value: '-40%',  label: 'No-shows' },
    ],
    decisions: [
      'Chose warm amber palette to evoke candlelit fine dining',
      'Kept navigation minimal — only Menu, Reserve, and About',
      'Prioritised mobile booking flow as 78% of traffic was mobile',
    ],
  },
  {
    id: 5,
    title: 'Bloom Aesthetics',
    industry: 'Beauty & Wellness',
    type: 'Website Redesign',
    year: '2025',
    size: 'md',
    isNew: false,
    image: null,
    beforeImage: null,
    afterImage: null,
    metricValue: '+310%',
    metricLabel: 'Bookings',
    color: '#EC4899',
    tags: ['UI/UX', 'Booking System', 'SEO'],
    category: 'design',
    problem: 'Beauty clinic relying on Instagram DMs for bookings, losing high-value clients to competitors with professional online presence.',
    problems: [
      'All bookings managed through Instagram DMs — chaotic and unscalable',
      'No pricing transparency driving away conversion-ready visitors',
      'Before/after gallery was buried and hard to navigate',
      'Zero email capture meaning repeat business was near impossible',
    ],
    solutions: [
      'Built a 3-step booking flow with time-slot selection and deposit payment',
      'Designed transparent treatment pricing with clear package comparisons',
      'Created a full-screen before/after gallery as the hero section',
      'Added lead magnet and loyalty programme email capture',
    ],
    results: [
      { value: '+310%', label: 'Bookings' },
      { value: '+140%', label: 'Avg. Order Value' },
      { value: '2,400', label: 'Email Subscribers' },
      { value: '-60%',  label: 'Admin Time' },
    ],
    decisions: [
      'Chose soft rose palette to convey luxury and trust simultaneously',
      'Hero section leads with transformation results, not services',
      'Booking flow designed to collect key info upfront to reduce no-shows',
    ],
  },
  {
    id: 6,
    title: 'IronForge Gym',
    industry: 'Fitness',
    type: 'Full Brand & Web',
    year: '2025',
    size: 'wide',
    isNew: false,
    image: null,
    beforeImage: null,
    afterImage: null,
    metricValue: '+180%',
    metricLabel: 'Memberships',
    color: '#EF4444',
    tags: ['Branding', 'Web Design', 'Marketing'],
    category: 'branding',
    problem: 'Independent gym struggling to compete with national chains despite offering superior coaching and community.',
    problems: [
      'Generic branding with no differentiation from national gym chains',
      'Membership sign-up required an in-person visit — losing online traffic',
      'Class schedule was managed via a Facebook group post',
      'No mechanism to showcase coaching credentials and community culture',
    ],
    solutions: [
      'Built a bold, high-energy brand identity centered on "real results, real people"',
      'Launched online membership sign-up with tiered plans and payment processing',
      'Built a live class timetable with digital booking and waitlist',
      'Created a members results wall with testimonials and transformation stories',
    ],
    results: [
      { value: '+180%', label: 'Memberships' },
      { value: '+95%',  label: 'Class Fill Rate' },
      { value: '-50%',  label: 'Churn Rate' },
      { value: '+240%', label: 'PT Enquiries' },
    ],
    decisions: [
      'Chose high-contrast red/black to signal intensity and commitment',
      'Community-first messaging over equipment and facilities',
      'Landing page A/B tested — free trial CTA outperformed discount CTA by 3×',
    ],
  },
  {
    id: 7,
    title: 'UrbanNest Realty',
    industry: 'Real Estate',
    type: 'Platform & Web',
    year: '2025',
    size: 'sm',
    isNew: false,
    image: null,
    beforeImage: null,
    afterImage: null,
    metricValue: '+260%',
    metricLabel: 'Enquiries',
    color: '#6366F1',
    tags: ['Development', 'UI/UX', 'Maps API'],
    category: 'development',
    problem: 'Real estate agency losing qualified leads to property portals charging high listing fees and showing competitor listings.',
    problems: [
      'Over-reliance on Rightmove and Zoopla eroding margin and brand control',
      'No property search on own website — buyers left immediately',
      'Valuation request form had a 92% abandonment rate',
      'No CRM integration — leads were missed or responded to days late',
    ],
    solutions: [
      'Built a branded property search with interactive map and saved searches',
      'Redesigned valuation flow — instant estimate + human follow-up in 24h',
      'Integrated Pipedrive CRM with automated lead assignment and email sequences',
      'Launched neighbourhood guides as SEO content to capture organic traffic',
    ],
    results: [
      { value: '+260%', label: 'Enquiries' },
      { value: '+120%', label: 'Valuations' },
      { value: '4h',    label: 'Avg. Response Time' },
      { value: '-35%',  label: 'Portal Dependency' },
    ],
    decisions: [
      'Chose map-first listing experience based on user research — buyers scan by area',
      'Instant valuation estimate built trust even before human contact',
      'Neighbourhood content targeted zero-competition long-tail keywords',
    ],
  },
  {
    id: 8,
    title: 'Peak Financial',
    industry: 'Financial Services',
    type: 'Website Redesign',
    year: '2025',
    size: 'sm',
    isNew: false,
    image: null,
    beforeImage: null,
    afterImage: null,
    metricValue: '+195%',
    metricLabel: 'Consultations',
    color: '#0EA5E9',
    tags: ['UI/UX', 'Compliance', 'Development'],
    category: 'design',
    problem: 'Independent financial adviser invisible online — all clients from word of mouth, zero digital acquisition.',
    problems: [
      'Website looked like it was built in 2009 — destroying trust instantly',
      'No clear articulation of services or ideal client profile',
      'No regulatory/compliance copy — required for FCA-authorised firms',
      'Zero content marketing — competitors dominated "financial adviser near me" searches',
    ],
    solutions: [
      'Rebuilt with modern, trustworthy design aligned to FCA compliance requirements',
      'Wrote clear service pages with client outcome focus and authority signals',
      'Created a retirement planning calculator as the primary lead magnet',
      'Launched a bi-monthly newsletter attracting organic subscribers from SEO',
    ],
    results: [
      { value: '+195%', label: 'Consultations' },
      { value: '#3',    label: 'Local SEO Rank' },
      { value: '1,800', label: 'Newsletter Subs' },
      { value: '+88%',  label: 'Avg. Client Value' },
    ],
    decisions: [
      'Deep blue palette signals stability and trust — critical in financial services',
      'Calculator placed above the fold — captures intent before hard sell',
      'Compliance copy written with solicitor review, reducing regulatory risk',
    ],
  },
  {
    id: 9,
    title: 'Voyage Collective',
    industry: 'Travel & Tourism',
    type: 'Booking Platform',
    year: '2025',
    size: 'wide',
    isNew: true,
    image: null,
    beforeImage: null,
    afterImage: null,
    metricValue: '+440%',
    metricLabel: 'Bookings',
    color: '#F97316',
    tags: ['UI/UX', 'Booking', 'Development'],
    category: 'development',
    problem: 'Boutique travel agency manually handling all bookings via email — unable to scale and losing tech-savvy travellers to OTAs.',
    problems: [
      'All trip bookings managed through email chains taking days to confirm',
      'No itinerary builder — clients received static PDF quotes',
      'Zero ability for customers to self-serve, browse, or compare trips',
      'Seasonal demand spikes overwhelmed the small team every summer',
    ],
    solutions: [
      'Built a full booking platform with real-time availability and instant confirmation',
      'Created an interactive itinerary builder with day-by-day customisation',
      'Developed a trip discovery feature with filters for style, budget, and destination',
      'Automated booking confirmation, payment, and pre-departure email sequences',
    ],
    results: [
      { value: '+440%', label: 'Bookings' },
      { value: '92%',   label: 'Self-Serve Rate' },
      { value: '-75%',  label: 'Admin Hours' },
      { value: '+320%', label: 'Repeat Bookings' },
    ],
    decisions: [
      'Built on headless CMS so travel team can update trip content without dev help',
      'Immersive video hero converts 2.4× better than static imagery for travel',
      'Deposit-first payment flow reduced abandoned checkouts by 58%',
    ],
  },
  {
    id: 10,
    title: 'Meridian Legal',
    industry: 'Legal Services',
    type: 'Website & SEO',
    year: '2025',
    size: 'sm',
    isNew: true,
    image: null,
    beforeImage: null,
    afterImage: null,
    metricValue: '+290%',
    metricLabel: 'Case Enquiries',
    color: '#475569',
    tags: ['UI/UX', 'SEO', 'Content Strategy'],
    category: 'design',
    problem: 'Mid-size law firm with strong reputation but no digital presence — losing high-value cases to less experienced but digitally active competitors.',
    problems: [
      'Website had no practice area pages — invisible for service-specific searches',
      'No client testimonials or case results — trust gap vs. competitor firms',
      'Contact form was the only CTA — high-friction for urgent legal situations',
      'Blog section had not been updated since 2021',
    ],
    solutions: [
      'Built 12 dedicated practice area pages with long-tail SEO targeting',
      'Created a verified results and testimonials section with structured data markup',
      'Added live chat widget and "Call us now" sticky CTA for urgent enquiries',
      'Launched a content programme — 2 articles per month targeting legal FAQs',
    ],
    results: [
      { value: '+290%', label: 'Case Enquiries' },
      { value: '+160%', label: 'Organic Traffic' },
      { value: '#1',    label: 'Target Keywords' },
      { value: '+220%', label: 'High-Value Cases' },
    ],
    decisions: [
      'Chose navy/slate palette — signals authority without the intimidation of black',
      'Practice area pages structured for Featured Snippet capture on Google',
      'Results section uses anonymised summaries to maintain client confidentiality',
    ],
  },
  {
    id: 11,
    title: 'LifeCare Medical',
    industry: 'Healthcare',
    type: 'Healthcare Platform',
    year: '2025',
    size: 'md',
    isNew: false,
    problem: 'Outdated interface with high patient friction, causing drop-offs in appointment booking and online inquiries.',
    image: lifecareImg,
    beforeImage: null,
    afterImage: null,
    metricValue: '+45%',
    metricLabel: 'Conversion Rate',
    color: '#10B981',
    tags: ['UI/UX', 'Medical Platform', 'SEO'],
    category: 'design',
    problems: [
      'Appointment system took 8 steps and was not mobile friendly',
      'Zero patient onboarding resources leading to administrative overload',
      'High bounce rate due to slow loading speeds on imagery-rich pages',
    ],
    solutions: [
      'Streamlined patient portal to a fast 2-step booking flow',
      'Designed patient resources section for fast searchability',
      'Optimized hosting performance and image compressions',
    ],
    results: [
      { value: '+45%', label: 'Conversions' },
      { value: '-40%', label: 'Admin Time' },
      { value: '98%', label: 'Patient Satisfaction' },
    ],
    decisions: [
      'Prioritized privacy and accessibility standards compliance',
      'Kept brand colors sterile yet welcoming',
    ],
  },
  {
    id: 12,
    title: 'Grand Hotel',
    industry: 'Hospitality',
    type: 'Booking Website',
    year: '2025',
    size: 'wide',
    isNew: false,
    problem: 'Heavy reliance on third-party OTAs eroding margins, with direct booking website failing to attract and convert users.',
    image: hotelImg,
    beforeImage: null,
    afterImage: null,
    metricValue: '+30%',
    metricLabel: 'Direct Bookings',
    color: '#FBBF24',
    tags: ['Branding', 'Hotel Systems', 'Conversion'],
    category: 'branding',
    problems: [
      'High OTA commission fees reducing hospitality margins',
      'Room descriptions lacked visual storytelling and clear pricing',
      'Checkout process was non-secure and slow on mobile devices',
    ],
    solutions: [
      'Integrated custom room booking engine with direct API connectivity',
      'Built immersive room gallery pages with video capabilities',
      'Designed lightning-fast secure checkout flow with multiple payment methods',
    ],
    results: [
      { value: '+30%', label: 'Direct Bookings' },
      { value: '-22%', label: 'OTA Commission' },
      { value: '+140%', label: 'Average Stay Value' },
    ],
    decisions: [
      'Used luxurious gold accents to echo the premium offline experiences',
      'Emphasized direct booking perks (e.g. free breakfast) across pages',
    ],
  },
  {
    id: 13,
    title: 'Emerald Estates',
    industry: 'Real Estate',
    type: 'Luxury Real Estate Platform',
    year: '2025',
    size: 'lg',
    isNew: false,
    problem: 'Ultra-high-net-worth buyers exiting early due to generic UI templates and slow performance loading 4K photos.',
    image: emeraldImg,
    beforeImage: null,
    afterImage: null,
    metricValue: '+35%',
    metricLabel: 'Inquiries',
    color: '#047857',
    tags: ['UI/UX', 'Luxury Design', 'Development'],
    category: 'design',
    problems: [
      'Generic listings templates failed to convey high-end property value',
      'Zero lead qualification mechanisms for high-value properties',
      'Image galleries loaded slowly, degrading premium brand prestige',
    ],
    solutions: [
      'Designed bespoke property showcase templates featuring editorial layouts',
      'Integrated dynamic lead qualifier forms based on buyer budgets',
      'Implemented progressive loading and optimized hosting assets',
    ],
    results: [
      { value: '+35%', label: 'Inquiries' },
      { value: '1.4s', label: 'Load Time' },
      { value: '+220%', label: 'Qualified Leads' },
    ],
    decisions: [
      'Adopted a deep emerald and gold palette for brand consistency',
      'Focussed on visual immersion with minimal copywriting',
    ],
  },
  {
    id: 14,
    title: 'Opera Listings',
    industry: 'Real Estate',
    type: 'Property Platform',
    year: '2025',
    size: 'sm',
    isNew: false,
    problem: 'Static real estate listings failing to capture buyer engagement, resulting in low property viewing requests.',
    image: operaImg,
    beforeImage: null,
    afterImage: null,
    metricValue: 'Virtual Tours',
    metricLabel: 'Feature Launch',
    color: '#6366F1',
    tags: ['Web Design', 'Development', 'Virtual Tours'],
    category: 'development',
    problems: [
      'Buyers struggled to visualize property layouts from photos alone',
      'High volume of unqualified property viewings wasting agents time',
      'Slow loading listing pages on 3G/4G connections',
    ],
    solutions: [
      'Integrated interactive 3D virtual tours and floor plans into listing pages',
      'Built self-serve showing reservation system with verification steps',
      'Created performance-driven static pages utilizing Next.js configurations',
    ],
    results: [
      { value: '+85%', label: 'User Engagement' },
      { value: '-40%', label: 'Unqualified Viewings' },
      { value: '+50%', label: 'Virtual Showings' },
    ],
    decisions: [
      'Placed virtual tour buttons as the primary action on property cards',
      'Implemented automated follow-up emails for virtual tour attendees',
    ],
  },
  {
    id: 15,
    title: 'Reflect Fashion',
    industry: 'Fashion E-Commerce',
    type: 'Online Store',
    year: '2025',
    size: 'md',
    isNew: false,
    problem: 'Online clothing boutique suffering from a rigid e-commerce template with a high cart abandonment rate.',
    image: reflectImgImport,
    beforeImage: null,
    afterImage: null,
    metricValue: '+55%',
    metricLabel: 'Sales Growth',
    color: '#EC4899',
    tags: ['E-Commerce', 'UI/UX Design', 'Branding'],
    category: 'design',
    problems: [
      'High cart abandonment due to complex checkout processes',
      'Mobile layout made selecting product sizes and colors difficult',
      'Lacked personalized recommendation systems to boost order size',
    ],
    solutions: [
      'Designed clean single-page checkout flow with Apple Pay and Google Pay',
      'Built bottom-sheet selector menus optimized for mobile gestures',
      'Implemented smart recommendation widgets based on user behavior',
    ],
    results: [
      { value: '+55%', label: 'Sales Growth' },
      { value: '-30%', label: 'Cart Abandonment' },
      { value: '+25%', label: 'Avg. Order Size' },
    ],
    decisions: [
      'Chose neon colors and high-contrast styling to attract Gen-Z shoppers',
      'Integrated customer reviews directly into checkout sheets',
    ],
  },
  {
    id: 16,
    title: 'Aurum Jewellery',
    industry: 'Jewellery E-Commerce',
    type: 'Online Store',
    year: '2025',
    size: 'md',
    isNew: false,
    problem: 'Exquisite jewellery brand with poor digital storytelling, failing to build trust online and convert visitors into buyers.',
    image: aurumImgImport,
    beforeImage: null,
    afterImage: null,
    metricValue: '+70%',
    metricLabel: 'Online Sales',
    color: '#D97706',
    tags: ['E-Commerce', 'Development', 'Premium Design'],
    category: 'development',
    problems: [
      'Lacked high-resolution detailing zoom for premium fine jewellery',
      'Customer trust issues purchasing high-value luxury items online',
      'Poor site performance on mobile slowing product search speeds',
    ],
    solutions: [
      'Developed custom ultra-high-definition zoom viewer for items',
      'Built robust security signaling and certificates integration',
      'Optimized product data structures to speed up filtering and browsing',
    ],
    results: [
      { value: '+70%', label: 'Online Sales' },
      { value: '+40%', label: 'Brand Trust Score' },
      { value: '1.2s', label: 'Category Page Speed' },
    ],
    decisions: [
      'Designed minimal interfaces to emphasize jewellery images',
      'Added dynamic financing options integrations directly on product sheets',
    ],
  },
  {
    id: 17,
    title: 'Lost & Found Hub',
    industry: 'Mobile Applications',
    type: 'Cross-Platform Mobile App',
    year: '2025',
    size: 'sm',
    isNew: true,
    problem: 'University students losing valuable belongings on campus with no central, real-time method for report and recovery.',
    image: lostFoundImgImport,
    beforeImage: null,
    afterImage: null,
    metricValue: '10k+ Users',
    metricLabel: 'University Adoption',
    color: '#6366F1',
    tags: ['Mobile App', 'Development', 'Push Notifications'],
    category: 'development',
    problems: [
      'Slow physical bulletin board methods for lost items',
      'Lacked instant alert capabilities for high-value lost items',
      'Authentication issues restricting campus-only access security',
    ],
    solutions: [
      'Built a cross-platform React Native app with instant posting flows',
      'Integrated push notification triggers based on geofenced tags',
      'Implemented secure university email sign-on checks',
    ],
    results: [
      { value: '10k+', label: 'Active Users' },
      { value: '85%', label: 'Belongings Found' },
      { value: '<5m', label: 'Reporting Time' },
    ],
    decisions: [
      'Designed dashboard feed to emphasize recently posted items first',
      'Used map views for item tags rather than textual descriptions',
    ],
  },
  {
    id: 18,
    title: 'WorkDiary AI',
    industry: 'Mobile Applications',
    type: 'Voice & AI Assistant',
    year: '2025',
    size: 'sm',
    isNew: true,
    problem: 'Interns struggling to record daily progress and outcomes, leading to incomplete reports and feedback reviews.',
    image: diaryImgImport,
    beforeImage: null,
    afterImage: null,
    metricValue: 'AI Verified',
    metricLabel: 'Gemini AI API',
    color: '#8B5CF6',
    tags: ['Mobile App', 'AI Integration', 'Voice API'],
    category: 'development',
    problems: [
      'Manual daily logging was tedious and frequently forgotten by interns',
      'Writing quality of logs was poor and lacked actionable summaries',
      'No review analytics for university advisors and supervisors',
    ],
    solutions: [
      'Built voice-to-text logging app powered by Gemini AI summaries',
      'Integrated automatic log categorization and tag systems',
      'Designed supervisor review dashboard with interactive statistics',
    ],
    results: [
      { value: '100%', label: 'Completion Rate' },
      { value: '-80%', label: 'Log Prep Time' },
      { value: '4.9★', label: 'App Store Rating' },
    ],
    decisions: [
      'Implemented offline audio caching for logging without connections',
      'Adopted a calm, minimal workspace aesthetic to lower user friction',
    ],
  },
];

const CATEGORIES = ['all', ...new Set(caseStudies.map(c => c.category))];
const filters = CATEGORIES.map(cat => ({
  id: cat,
  label: cat === 'all' ? 'All Projects' : cat.charAt(0).toUpperCase() + cat.slice(1),
  count: cat === 'all' ? caseStudies.length : caseStudies.filter(c => c.category === cat).length,
}));

const SKELETON_LAYOUT = ['lg', 'wide', 'md', 'sm', 'md', 'wide', 'sm', 'sm', 'wide', 'sm', 'md', 'wide', 'lg', 'sm', 'md', 'md', 'sm', 'sm'];

const proofStats = [
  { endValue: 340, suffix: '%', label: 'Avg. lead increase', prefix: '+' },
  { endValue: 3, suffix: '', label: 'Sites delivered', prefix: '' },
  { endValue: 100, suffix: '%', label: 'On-time delivery', prefix: '' },
  { endValue: 4.4, suffix: 'M+', label: 'Client revenue unlocked', prefix: '$' },
];

const processSteps = [
  { num: '01', icon: <Target size={20} />, title: 'Discover', desc: 'Deep-dive into your business, users, and competitors to build a rock-solid strategy.' },
  { num: '02', icon: <Palette size={20} />, title: 'Design', desc: 'Pixel-perfect designs built for conversion — every decision backed by data.' },
  { num: '03', icon: <Code2 size={20} />, title: 'Deploy', desc: 'Lightning-fast build, rigorous QA, and a smooth launch with zero surprises.' },
];

/* ─────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────── */
const SkeletonCard = ({ size }) => (
  <div className="ow-skel" data-size={size} aria-hidden="true">
    <div className="ow-skel-inner" />
  </div>
);

/* ─────────────────────────────────────────
   PROJECT CARD  (image-first overlay)
───────────────────────────────────────── */
const ProjectCard = ({ project, onOpen }) => {
  const cardRef = useRef(null);
  const [cx, setCx] = useState(-999);
  const [cy, setCy] = useState(-999);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setCx(e.clientX - rect.left);
    setCy(e.clientY - rect.top);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCx(-999);
    setCy(-999);
  }, []);

  return (
    <article
      ref={cardRef}
      className="ow-card"
      data-size={project.size}
      style={{ '--ow-cx': cx + 'px', '--ow-cy': cy + 'px', '--ow-color': project.color }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(project); } }}
      aria-label={'View ' + project.title + ' case study'}
    >
      <div className="ow-card-spotlight" aria-hidden="true" />

      {project.image
        ? <img src={project.image} alt={project.title + ' screenshot'} className="ow-card-bg" loading="lazy" draggable="false" />
        : <div className="ow-card-bg ow-card-bg-placeholder" style={{ background: 'linear-gradient(135deg, #0E0F13 0%, ' + project.color + '44 100%)' }} aria-hidden="true" />
      }

      <div className="ow-metric-badge">
        <span className="ow-metric-val">{project.metricValue}</span>
        <span className="ow-metric-lbl">{project.metricLabel}</span>
      </div>

      {project.isNew && <span className="ow-new-badge">NEW</span>}

      <div className="ow-card-overlay">
        <div className="ow-card-footer">
          <div className="ow-card-header-row">
            <span className="ow-meta-pill">{project.industry}</span>
            {project.year && <span className="ow-year-tag">{project.year}</span>}
          </div>
          <h3 className="ow-card-title">{project.title}</h3>
          <div className="ow-card-reveal">
            <div className="ow-card-reveal-inner">
              <div className="ow-card-reveal-content">
                <div className="ow-card-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="ow-tag">{tag}</span>
                  ))}
                </div>
                <div className="ow-card-cta-row">
                  <span>View Case Study</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const OurWork = () => {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCase, setSelectedCase] = useState(null);
  const [modalState, setModalState] = useState(null); // 'open' | 'closing' | null
  const [isSticky, setIsSticky] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState(proofStats.map(() => 0));
  const [isLoading, setIsLoading] = useState(true);

  const sentinelRef = useRef(null);
  const statsRef = useRef(null);
  const sliderRef = useRef(null);
  const rafRef = useRef(null);
  const unlockScrollRef = useRef(null);

  /* ── Skeleton loading — waits for every real project image to decode ──
     Stays visible until ALL images are loaded (or errored).
     Minimum 500 ms so it never flashes on fast connections.
     Safety valve at 5 s in case a slow/broken image stalls the page. ── */
  useEffect(() => {
    const realImages = caseStudies.filter(p => p.image).map(p => p.image);

    // No real images (all placeholders) — skip immediately
    if (realImages.length === 0) {
      setIsLoading(false);
      return;
    }

    const startedAt = Date.now();
    const MIN_MS    = 500;  // never hide skeleton faster than this
    let   loaded    = 0;

    const tick = () => {
      loaded += 1;
      if (loaded < realImages.length) return; // still waiting
      const elapsed = Date.now() - startedAt;
      const wait    = Math.max(0, MIN_MS - elapsed);
      setTimeout(() => setIsLoading(false), wait);
    };

    // Safety: hide skeleton after 5 s even if some images stall / error
    const safetyTimer = setTimeout(() => setIsLoading(false), 5000);

    // Pre-fetch every real image so the card grid is already in cache
    realImages.forEach(src => {
      const img   = new window.Image();
      img.onload  = tick;
      img.onerror = tick; // errors count too — don't hang forever
      img.src     = src;
    });

    return () => clearTimeout(safetyTimer);
  }, []);

  /* ── Sticky filter ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    const el = sentinelRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(p => ({ ...p, [e.target.id]: true }));
      }),
      { threshold: 0.07, rootMargin: '0px 0px -5% 0px' }
    );
    document.querySelectorAll('[data-ow-animate]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Stats count-up trigger ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const el = statsRef.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Stats RAF animation ── */
  useEffect(() => {
    if (!statsVisible) return;
    const targets = proofStats.map(s => s.endValue);
    const startTime = performance.now();
    const duration = 1600;
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats(targets.map(t =>
        Number.isInteger(t) ? Math.round(t * ease) : Math.round(t * ease * 10) / 10
      ));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [statsVisible]);

  /* ── Escape key ── */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && modalState === 'open') closeModal(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalState]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Drag slider ── */
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    if (sliderRef.current) sliderRef.current.setPointerCapture(e.pointerId);
  };
  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos(Math.round((x / rect.width) * 100));
  }, [isDragging]);
  const handlePointerUp = useCallback(() => setIsDragging(false), []);

  /* ── Modal ── */
  const openModal = useCallback((project) => {
    setSelectedCase(project);
    setModalState('open');
    unlockScrollRef.current?.();
    unlockScrollRef.current = lockBodyScroll();
  }, []);
  const closeModal = useCallback(() => {
    setModalState('closing');
    unlockScrollRef.current?.();
    unlockScrollRef.current = null;
    setTimeout(() => { setModalState(null); setSelectedCase(null); }, 350);
  }, []);

  /* ── Route changes: ensure modal state and body lock are fully reset ── */
  useEffect(() => {
    setModalState(null);
    setSelectedCase(null);
    unlockScrollRef.current?.();
    unlockScrollRef.current = null;
  }, [location.pathname]);

  /* ── Unmount safety: never leave page with scroll locked ── */
  useEffect(() => {
    return () => {
      unlockScrollRef.current?.();
      unlockScrollRef.current = null;
    };
  }, []);

  const vis = (id) => visibleSections[id] ? 'ow-visible' : 'ow-hidden';

  const filteredProjects = activeFilter === 'all'
    ? caseStudies
    : caseStudies.filter(c => c.category === activeFilter);

  const sliderProject = caseStudies.find(c => c.size === 'lg') || caseStudies[0];

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="ow-page">

      {/* ── HERO ── */}
      <div className="ow-hero-wrapper">
        <NavBar />
        <section className="ow-hero">
          <div className="ow-orb ow-orb-1" aria-hidden="true" />
          <div className="ow-orb ow-orb-2" aria-hidden="true" />
          <div className="ow-orb ow-orb-3" aria-hidden="true" />

          <div className="ow-hero-content">
            <p className="ow-eyebrow">— OUR WORK —</p>
            <h1 className="ow-hero-title">
              Work That<br /><span className="ow-accent">Speaks Numbers.</span>
            </h1>
            <p className="ow-hero-sub">
              Every project below delivered measurable ROI. Real results,
              real businesses, real growth — no stock photos, no fake metrics.
            </p>
            <div className="ow-hero-badges">
              <div className="ow-hero-badge ow-badge-1">
                <TrendingUp size={14} /><span>+340% avg. leads</span>
              </div>
              <div className="ow-hero-badge ow-badge-2">
                <Globe size={14} /><span>3 Industries</span>
              </div>
              <div className="ow-hero-badge ow-badge-3">
                <BarChart2 size={14} /><span>$4.4M+ revenue</span>
              </div>
            </div>
          </div>

          <a className="ow-scroll-hint" href="#ow-projects" aria-label="Scroll to projects">
            <ArrowDown size={20} />
          </a>
        </section>
        <div ref={sentinelRef} className="ow-sentinel" aria-hidden="true" />
      </div>

      {/* ── STICKY FILTER BAR ── */}
      <div className={'ow-filter-bar' + (isSticky ? ' ow-filter-sticky' : '')}>
        <div className="ow-filter-inner">
          {filters.map(f => (
            <button
              key={f.id}
              className={'ow-pill' + (activeFilter === f.id ? ' ow-pill-active' : '')}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
              <span className="ow-pill-count">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── BENTO PROJECT GRID ── */}
      <section className="ow-projects-section" id="ow-projects">
        <div className="ow-projects-container">

          <div className={'ow-bento' + (isLoading ? ' ow-bento-loading' : '')}>
            {isLoading
              ? SKELETON_LAYOUT.map((size, i) => <SkeletonCard key={i} size={size} />)
              : filteredProjects.map(p => (
                  <ProjectCard key={p.id} project={p} onOpen={openModal} />
                ))
            }
            {!isLoading && filteredProjects.length === 0 && (
              <p className="ow-empty">No projects in this category yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── PROOF STRIP ── */}
      <section
        ref={statsRef}
        id="ow-proof"
        data-ow-animate
        className={'ow-proof-section ' + vis('ow-proof')}
      >
        <div className="ow-proof-inner">
          <p className="ow-proof-eyebrow">— THE NUMBERS DON'T LIE —</p>
          <div className="ow-proof-grid">
            {proofStats.map((s, i) => (
              <div key={i} className="ow-proof-stat">
                <span className="ow-proof-num">{s.prefix}{animatedStats[i]}{s.suffix}</span>
                <span className="ow-proof-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER SLIDER ── */}
      <section
        id="ow-slider"
        data-ow-animate
        className={'ow-slider-section ' + vis('ow-slider')}
      >
        <div className="ow-slider-container">
          <div className="ow-slider-header">
            <p className="ow-section-eyebrow">— VISUAL TRANSFORMATION —</p>
            <h2 className="ow-section-title">Before &amp; After</h2>
            <p className="ow-section-sub">
              Drag the handle to compare {sliderProject.title} before and after our redesign.
            </p>
          </div>

          <div
            ref={sliderRef}
            className={'ow-compare-track' + (isDragging ? ' ow-dragging' : '')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <img src={sliderProject.afterImage} alt="After redesign" className="ow-compare-after" draggable="false" />
            <div className="ow-compare-before-wrap" style={{ width: sliderPos + '%' }}>
              <img src={sliderProject.beforeImage} alt="Before redesign" className="ow-compare-before" draggable="false" />
            </div>
            <span className="ow-compare-label ow-label-before">Before</span>
            <span className="ow-compare-label ow-label-after">After</span>
            <div
              className="ow-compare-handle"
              style={{ left: sliderPos + '%' }}
              onPointerDown={handlePointerDown}
            >
              <div className="ow-handle-line" />
              <div className="ow-handle-knob">
                <ChevronLeft size={13} />
                <ChevronRight size={13} />
              </div>
              <div className="ow-handle-line" />
            </div>
          </div>

          <div className="ow-slider-results">
            {sliderProject.results.map((r, i) => (
              <div key={i} className="ow-slider-result">
                <span className="ow-slider-result-val" style={{ color: sliderProject.color }}>{r.value}</span>
                <span className="ow-slider-result-lbl">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS TEASER ── */}
      <section
        id="ow-process"
        data-ow-animate
        className={'ow-process-section ' + vis('ow-process')}
      >
        <div className="ow-process-container">
          <p className="ow-section-eyebrow">— HOW WE MAKE IT HAPPEN —</p>
          <h2 className="ow-section-title">Three Steps to Results</h2>
          <div className="ow-process-track">
            {processSteps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="ow-process-step">
                  <div className="ow-step-top">
                    <span className="ow-step-num">{step.num}</span>
                    <div className="ow-step-icon">{step.icon}</div>
                  </div>
                  <h3 className="ow-step-title">{step.title}</h3>
                  <p className="ow-step-desc">{step.desc}</p>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="ow-step-connector" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONFIDENCE BUILDER ── */}
      <section
        id="ow-confidence"
        data-ow-animate
        className={'ow-confidence-section ' + vis('ow-confidence')}
      >
        <div className="ow-confidence-container">
          <div className="ow-confidence-card">
            <div className="ow-confidence-accent-bar" />
            <div className="ow-confidence-body">
              <p className="ow-section-eyebrow">— WHY WE'RE SELECTIVE —</p>
              <h2 className="ow-confidence-title">
                We Say No to<br /><span className="ow-accent">60% of Projects.</span>
              </h2>
              <p className="ow-confidence-intro">
                Not because we don't need the work — because we only take projects where we can guarantee results.
              </p>
              <div className="ow-story-grid">
                <div className="ow-story-block">
                  <span className="ow-story-tag">The Request</span>
                  <p>"A well-funded startup approached us for a complete rebrand. Budget: $50K. Timeline: 3 weeks."</p>
                </div>
                <div className="ow-story-block">
                  <span className="ow-story-tag">The Problem</span>
                  <p>Their timeline made proper user research impossible — we'd be guessing, not designing from data.</p>
                </div>
                <div className="ow-story-block">
                  <span className="ow-story-tag">Our Response</span>
                  <p>We declined but offered a phased approach: 6-week discovery + 4-week execution. They went elsewhere.</p>
                </div>
                <div className="ow-story-block ow-story-outcome">
                  <span className="ow-story-tag ow-tag-outcome">3 Months Later</span>
                  <p>They came back. The rushed rebrand had failed. We did it right — now one of our happiest clients with <strong>+180% user engagement.</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA + FOOTER ── */}
      <CTA />
      <Footer />

      {/* ══════════════════════════════════════
          MODAL
      ══════════════════════════════════════ */}
      <div
        className={'ow-modal-overlay' + (modalState === 'open' ? ' ow-overlay-in' : '') + (modalState === 'closing' ? ' ow-overlay-out' : '')}
        onClick={closeModal}
        aria-hidden={modalState === null}
      >
        <div
          className={'ow-modal' + (modalState === 'open' ? ' ow-modal-in' : '') + (modalState === 'closing' ? ' ow-modal-out' : '')}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {selectedCase && (
            <>
              {/* Header */}
              <div className="ow-modal-header" style={{ '--modal-color': selectedCase.color }}>
                <div className="ow-modal-header-content">
                  <div className="ow-modal-meta">
                    <span className="ow-meta-pill">{selectedCase.industry}</span>
                    <span className="ow-meta-sep">&middot;</span>
                    <span className="ow-meta-pill">{selectedCase.type}</span>
                  </div>
                  <h2 className="ow-modal-title">{selectedCase.title}</h2>
                  <div className="ow-modal-hero-metric">
                    <span className="ow-modal-metric-val" style={{ color: selectedCase.color }}>{selectedCase.metricValue}</span>
                    <span className="ow-modal-metric-lbl">{selectedCase.metricLabel}</span>
                  </div>
                </div>
                <button className="ow-modal-close" onClick={closeModal} aria-label="Close modal">
                  <X size={22} />
                </button>
              </div>

              <div className="ow-modal-body">
                {/* Before / After — only shown when screenshots exist */}
                {selectedCase.beforeImage && selectedCase.afterImage && (
                  <div className="ow-modal-section">
                    <h3 className="ow-modal-section-title">Visual Transformation</h3>
                    <div className="ow-modal-ba-grid">
                      <div className="ow-modal-ba-item">
                        <span className="ow-ba-label ow-ba-before">Before</span>
                        <img src={selectedCase.beforeImage} alt="Before" className="ow-modal-ba-img" loading="lazy" />
                      </div>
                      <div className="ow-modal-ba-item">
                        <span className="ow-ba-label ow-ba-after">After</span>
                        <img src={selectedCase.afterImage} alt="After" className="ow-modal-ba-img" loading="lazy" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Problems */}
                <div className="ow-modal-section">
                  <h3 className="ow-modal-section-title">The Challenges</h3>
                  <ul className="ow-modal-problem-list">
                    {selectedCase.problems.map((p, i) => (
                      <li key={i}>
                        <span className="ow-prob-icon"><X size={13} /></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Solutions */}
                <div className="ow-modal-section">
                  <h3 className="ow-modal-section-title">Our Solutions</h3>
                  <div className="ow-modal-sol-grid">
                    {selectedCase.solutions.map((s, i) => (
                      <div key={i} className="ow-modal-sol-item">
                        <span className="ow-sol-num" style={{ background: selectedCase.color }}>{i + 1}</span>
                        <p>{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="ow-modal-results-grid">
                  {selectedCase.results.map((r, i) => (
                    <div key={i} className="ow-modal-result-card">
                      <span className="ow-modal-res-val" style={{ color: selectedCase.color }}>{r.value}</span>
                      <span className="ow-modal-res-lbl">{r.label}</span>
                    </div>
                  ))}
                </div>

                {/* Decisions */}
                <div className="ow-modal-section">
                  <h3 className="ow-modal-section-title">Key Strategic Decisions</h3>
                  <ul className="ow-modal-dec-list">
                    {selectedCase.decisions.map((d, i) => (
                      <li key={i}>
                        <span className="ow-dec-icon" style={{ color: selectedCase.color }}><Check size={14} /></span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="ow-modal-footer">
                <p>Ready to write your own success story?</p>
                <Link
                  to="/plan"
                  className="ow-modal-cta"
                  style={{ background: selectedCase.color }}
                  onClick={closeModal}
                >
                  <span>Start Your Project</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default OurWork;
