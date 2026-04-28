/**
 * DeliverableCard.jsx
 * Displays a single deliverable with role-aware action buttons.
 * Implements: lazy image loading (IntersectionObserver), double-click
 * prevention on action buttons, optimistic status display.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Image as ImgIcon, Film, Music, Archive } from "lucide-react";

const STATUS_META = {
  draft:           { label: "Draft",            cls: "gg-dlv-status--draft" },
  review:          { label: "Awaiting Review",   cls: "gg-dlv-status--review" },
  approved:        { label: "Approved",          cls: "gg-dlv-status--approved" },
  revision_needed: { label: "Revision Needed",   cls: "gg-dlv-status--revision" },
};

function FileIcon({ mimeType }) {
  if (!mimeType) return <FileText size={28} strokeWidth={1.2} />;
  if (mimeType.startsWith("image/")) return <ImgIcon size={28} strokeWidth={1.2} />;
  if (mimeType.startsWith("video/")) return <Film size={28} strokeWidth={1.2} />;
  if (mimeType.startsWith("audio/")) return <Music size={28} strokeWidth={1.2} />;
  return <Archive size={28} strokeWidth={1.2} />;
}

/** Lazy-loaded thumbnail that only fetches the image when visible. */
function LazyThumbnail({ fileUrl, mimeType, alt }) {
  const divRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!divRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: "100px" }
    );
    observer.observe(divRef.current);
    return () => observer.disconnect();
  }, []);

  const isImage = mimeType?.startsWith("image/");

  return (
    <div ref={divRef} className="gg-dlv-thumb">
      {visible && isImage && fileUrl ? (
        <img src={fileUrl} alt={alt} className="gg-dlv-thumb-img" loading="lazy" />
      ) : (
        <FileIcon mimeType={mimeType} />
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DeliverableCard({ deliverable, currentUserRole, onStatusChange, loading }) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const clickLock = useRef(false);

  const meta = STATUS_META[deliverable.status] || STATUS_META.draft;

  /** Prevents double-click: locks for 800ms after first click. */
  const handleAction = useCallback(
    async (newStatus) => {
      if (clickLock.current || loading) return;
      clickLock.current = true;
      try {
        await onStatusChange(deliverable.id, newStatus, comment || undefined);
        setCommentOpen(false);
        setComment("");
      } finally {
        setTimeout(() => { clickLock.current = false; }, 800);
      }
    },
    [comment, deliverable.id, loading, onStatusChange]
  );

  const isAdmin  = currentUserRole === "admin";
  const isTeam   = currentUserRole === "team";
  const isClient = currentUserRole === "client";

  return (
    <div className={`gg-deliverable-card gg-dlv-status-border--${deliverable.status}`}>
      {/* Thumbnail */}
      <LazyThumbnail
        fileUrl={deliverable.file_url}
        mimeType={deliverable.mime_type}
        alt={deliverable.title}
      />

      {/* Info */}
      <div className="gg-dlv-info">
        <div className="gg-dlv-info-top">
          <span className={`gg-dlv-status-pill ${meta.cls}`}>{meta.label}</span>
          {deliverable.file_size && (
            <span className="gg-dlv-meta">{formatBytes(deliverable.file_size)}</span>
          )}
        </div>
        <h4 className="gg-dlv-title">{deliverable.title}</h4>
        {deliverable.description && (
          <p className="gg-dlv-description">{deliverable.description}</p>
        )}

        {deliverable.review_comment && (
          <div className="gg-dlv-comment">
            <span className="gg-dlv-comment-label">Feedback: </span>
            {deliverable.review_comment}
          </div>
        )}

        <div className="gg-dlv-uploader">
          Uploaded by <strong>{deliverable.uploader_name || "Team"}</strong>
          {deliverable.uploaded_at && (
            <> · {new Date(deliverable.uploaded_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="gg-dlv-actions">
        {/* Admin or Team: submit draft → review */}
        {(isAdmin || isTeam) && deliverable.status === "draft" && (
          <button
            className="gg-btn gg-btn-sm gg-btn-primary"
            disabled={loading}
            onClick={() => handleAction("review")}
          >
            {loading ? "Submitting…" : "Submit for Review"}
          </button>
        )}

        {/* Admin: can also move review → approved or revision_needed */}
        {isAdmin && deliverable.status === "review" && !commentOpen && (
          <>
            <button
              className="gg-btn gg-btn-sm gg-btn-success"
              disabled={loading}
              onClick={() => handleAction("approved")}
            >
              Approve
            </button>
            <button
              className="gg-btn gg-btn-sm gg-btn-warn"
              disabled={loading}
              onClick={() => setCommentOpen(true)}
            >
              Request Revision
            </button>
          </>
        )}

        {/* Client: approve or request revision when in review */}
        {isClient && deliverable.status === "review" && !commentOpen && (
          <>
            <button
              className="gg-btn gg-btn-sm gg-btn-success"
              disabled={loading}
              onClick={() => handleAction("approved")}
            >
              Approve
            </button>
            <button
              className="gg-btn gg-btn-sm gg-btn-warn"
              disabled={loading}
              onClick={() => setCommentOpen(true)}
            >
              Request Revision
            </button>
          </>
        )}

        {/* Comment box for revision requests */}
        {commentOpen && (
          <div className="gg-dlv-comment-form">
            <textarea
              className="gg-dlv-textarea"
              placeholder="Describe what needs to change…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <div className="gg-dlv-comment-btns">
              <button
                className="gg-btn gg-btn-sm gg-btn-warn"
                disabled={loading || !comment.trim()}
                onClick={() => handleAction("revision_needed")}
              >
                {loading ? "Sending…" : "Send Revision Request"}
              </button>
              <button
                className="gg-btn gg-btn-sm gg-btn-ghost"
                onClick={() => { setCommentOpen(false); setComment(""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Download link */}
        {deliverable.file_url && (
          <a
            href={deliverable.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="gg-btn gg-btn-sm gg-btn-ghost"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}
