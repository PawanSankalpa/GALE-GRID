/**
 * client/src/portals/partner/pages/PartnerResourcesPage.jsx
 * Marketing materials, brand assets, email templates, and pitch decks for partners.
 */
import React, { useEffect, useState } from "react";
import { apiClient } from "../../../services/apiClient.js";
import {
  Download, Palette, Mail, PresentationIcon,
  Lightbulb, Image, ExternalLink, BookOpen,
} from "lucide-react";

// ── Static fallback resource catalogue ──────────────────────────
const STATIC_RESOURCES = [
  {
    category: "Brand Materials",
    icon: Palette,
    items: [
      { title: "Logo Pack (PNG / SVG)", description: "Full-resolution logos for all use cases.", file: "/assets/brand/logos.zip" },
      { title: "Brand Colours & Fonts", description: "Official hex codes, typography guidelines.", file: "/assets/brand/guidelines.pdf" },
      { title: "Social Media Banner Kit", description: "Sized for LinkedIn, Twitter, Facebook.", file: "/assets/brand/social-kit.zip" },
    ],
  },
  {
    category: "Email Templates",
    icon: Mail,
    items: [
      { title: "Cold Outreach Template", description: "Introductory email for prospect outreach.", file: "/assets/email/cold-outreach.html" },
      { title: "Follow-Up Template", description: "Second-touch email after initial interest.", file: "/assets/email/follow-up.html" },
      { title: "Closing Template", description: "Final push to convert warm leads.", file: "/assets/email/closing.html" },
    ],
  },
  {
    category: "Pitch Decks",
    icon: PresentationIcon,
    items: [
      { title: "Services Overview Deck", description: "15-slide presentation of core offerings.", file: "/assets/decks/services-overview.pptx" },
      { title: "Case Studies Deck", description: "Real results to share with prospects.", file: "/assets/decks/case-studies.pptx" },
      { title: "Pricing Guide", description: "Transparent pricing for partner use only.", file: "/assets/decks/pricing-guide.pdf" },
    ],
  },
  {
    category: "Referral Tips",
    icon: Lightbulb,
    items: [
      { title: "Partner Playbook", description: "Step-by-step guide on referring leads.", file: "/assets/guides/partner-playbook.pdf" },
      { title: "FAQ Sheet", description: "Answers to common client questions.", file: "/assets/guides/faq.pdf" },
      { title: "LinkedIn Post Swipe File", description: "Ready-to-post copy for social promotion.", file: "/assets/guides/linkedin-swipe.pdf" },
    ],
  },
];

// ── ResourceCard ─────────────────────────────────────────────────
function ResourceCard({ item }) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = item.url || item.file || "#";
    link.download = item.title;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pp-resource-card">
      <div className="pp-resource-icon">
        {item.icon ? (
          <item.icon size={20} />
        ) : (
          <BookOpen size={20} />
        )}
      </div>
      <div className="pp-resource-info">
        <p className="pp-resource-title">{item.title}</p>
        <p className="pp-resource-desc">{item.description}</p>
        {item.url && item.url.startsWith("http") ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="pp-resource-download">
            <ExternalLink size={13} /> Open
          </a>
        ) : (
          <button className="pp-resource-download" onClick={handleDownload}>
            <Download size={13} /> Download
          </button>
        )}
      </div>
    </div>
  );
}

// ── PartnerResourcesPage ─────────────────────────────────────────
export default function PartnerResourcesPage() {
  const [catalogue, setCatalogue] = useState(STATIC_RESOURCES);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    apiClient.get("/api/partners/resources")
      .then((res) => {
        const raw = res.data;
        if (Array.isArray(raw) && raw.length > 0) setCatalogue(raw);
      })
      .catch(() => {
        // Fall back to static catalogue — already set
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pp-empty">Loading resources…</div>;

  return (
    <div>
      <div className="pp-page-header">
        <h1 className="pp-page-title">Resources</h1>
        <p className="pp-page-sub">Everything you need to promote our services and win referrals.</p>
      </div>

      {/* Quick tiles */}
      <div className="pp-kpi-row" style={{ marginBottom: 24 }}>
        {[
          { label: "Brand Assets",    value: "3",   icon: Image,   color: "var(--pp-accent)"  },
          { label: "Email Templates", value: "3",   icon: Mail,    color: "var(--pp-success)" },
          { label: "Pitch Decks",     value: "3",   icon: PresentationIcon, color: "var(--pp-warn)" },
          { label: "Guides",          value: "3",   icon: BookOpen, color: "var(--pp-text-muted)" },
        ].map((t) => (
          <div key={t.label} className="pp-kpi-card">
            <div style={{ color: t.color, marginBottom: 8 }}><t.icon size={18} /></div>
            <p className="pp-kpi-value">{t.value}</p>
            <p className="pp-kpi-label">{t.label}</p>
          </div>
        ))}
      </div>

      {/* Resource sections */}
      {catalogue.map((section) => {
        const SectionIcon = section.icon || BookOpen;
        return (
          <div key={section.category} className="pp-card" style={{ marginBottom: 20 }}>
            <div className="pp-card-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <SectionIcon size={18} style={{ color: "var(--pp-accent)" }} />
                <h3 className="pp-card-title">{section.category}</h3>
              </div>
              <p className="pp-card-sub">{section.items?.length || 0} items</p>
            </div>
            <div className="pp-card-body">
              <div className="pp-resource-grid">
                {(section.items || []).map((item, idx) => (
                  <ResourceCard key={item.title || idx} item={item} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
