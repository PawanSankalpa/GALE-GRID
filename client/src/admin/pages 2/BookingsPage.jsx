import React, { useCallback, useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import CopyButton from "../components/CopyButton.jsx";
import { useToast } from "../components/Toast.jsx";
import { apiClient } from "../../services/apiClient.js";

const STATUS_TABS = ["all", "pending", "confirmed", "cancelled", "no_show"];
const STATUS_LABEL = { all: "All", pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled", no_show: "No Show" };
const STATUS_COLOR = {
  pending:   { bg: "#fff7ed", text: "#c2410c" },
  confirmed: { bg: "#f0fdf4", text: "#15803d" },
  cancelled: { bg: "#fef2f2", text: "#b91c1c" },
  no_show:   { bg: "#f1f5f9", text: "#475569" },
};

function StatusBadge({ status }) {
  const color = STATUS_COLOR[status] || STATUS_COLOR.pending;
  return (
    <span style={{
      background: color.bg, color: color.text,
      fontSize: 12, fontWeight: 600, padding: "3px 10px",
      borderRadius: 999, letterSpacing: "0.04em",
    }}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [tab, setTab]           = useState("all");
  const toast = useToast();

  const fetchBookings = useCallback((activeTab) => {
    setLoading(true);
    const query = activeTab !== "all" ? `?status=${activeTab}` : "";
    apiClient.get(`/api/bookings${query}`)
      .then((res) => {
        setBookings(Array.isArray(res.data) ? res.data : []);
        setError("");
      })
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBookings(tab); }, [tab, fetchBookings]);

  const fmt = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <PageWrapper>
      <div className="gg-page-header">
        <div>
          <h1 className="gg-page-title">Bookings</h1>
          <p className="gg-page-sub">Discovery calls booked through the website</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="gg-tabs" style={{ marginBottom: 20 }}>
        {STATUS_TABS.map((t) => (
          <button
            key={t}
            className={`gg-tab${tab === t ? " gg-tab--active" : ""}`}
            onClick={() => setTab(t)}
          >
            {STATUS_LABEL[t]}
          </button>
        ))}
      </div>

      {error && <p className="gg-error-banner">{error}</p>}

      {loading ? (
        <div className="gg-loading">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="gg-empty-state">
          <p>No bookings found{tab !== "all" ? ` for status "${STATUS_LABEL[tab]}"` : ""}.</p>
        </div>
      ) : (
        <div className="gg-table-wrap">
          <table className="gg-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Budget</th>
                <th>Service</th>
                <th>Status</th>
                <th>Scheduled</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.name || "—"}</strong></td>
                  <td>
                    <span className="gg-cell-copy">
                      <span className="gg-cell-copy-text">
                        <a href={`mailto:${b.email}`} style={{ color: "inherit" }}>{b.email || "—"}</a>
                      </span>
                      {b.email && (
                        <CopyButton
                          text={b.email}
                          label={`Copy email ${b.email}`}
                          onCopied={() => toast.success("Email copied!")}
                        />
                      )}
                    </span>
                  </td>
                  <td>
                    <span className="gg-cell-copy">
                      <span className="gg-cell-copy-text">{b.phone || "—"}</span>
                      {b.phone && (
                        <CopyButton
                          text={b.phone}
                          label={`Copy phone ${b.phone}`}
                          onCopied={() => toast.success("Phone copied!")}
                        />
                      )}
                    </span>
                  </td>
                  <td>{b.budget || "—"}</td>
                  <td>{b.service || "—"}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td style={{ whiteSpace: "nowrap" }}>{fmt(b.scheduledAt)}</td>
                  <td style={{ whiteSpace: "nowrap", color: "#94a3b8", fontSize: 13 }}>{fmt(b.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}
