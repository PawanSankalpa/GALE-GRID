/**
 * client/src/admin/components/FileAttachButton.jsx
 * Engineering pattern: file upload with MIME allowlist + 10 MB size guard (client-side).
 * Calls POST /api/uploads/attachment and returns the attachment metadata.
 */
import React, { useRef, useState } from "react";
import apiClient from "../../services/apiClient";
import { Paperclip, X, Loader2 } from "lucide-react";

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export default function FileAttachButton({ projectId, onAttached, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Client-side guards
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("File type not allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File exceeds 10 MB limit.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (projectId) formData.append("projectId", projectId);

    try {
      setUploading(true);
      const resp = await apiClient.post("/api/uploads/attachment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onAttached?.(resp.data.attachment);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="gg-attach-btn-wrap">
      <button
        type="button"
        className="gg-attach-btn"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        title="Attach file"
        aria-label="Attach file"
      >
        {uploading ? (
          <Loader2 size={16} className="gg-spin" />
        ) : (
          <Paperclip size={16} />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        hidden
        onChange={handleFileChange}
      />

      {error && (
        <span className="gg-attach-error">
          {error}
          <button
            type="button"
            className="gg-attach-error-dismiss"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            <X size={12} />
          </button>
        </span>
      )}
    </div>
  );
}
