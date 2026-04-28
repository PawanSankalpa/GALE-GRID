/**
 * client/src/admin/pages/FilesPage.jsx
 * Central asset library — upload, search, filter by client/project, folders.
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import PageWrapper from "../components/PageWrapper.jsx";
import { apiClient } from "../../services/apiClient.js";
import { useToast } from "../components/Toast.jsx";
import {
  Upload, Search, File, FileText, Image, Download,
  Trash2, Folder, X, Paperclip,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────
function fileIcon(mime = "") {
  if (mime.startsWith("image/"))        return <Image size={18} className="gg-file-icon gg-file-icon--image" />;
  if (mime.includes("pdf"))             return <FileText size={18} className="gg-file-icon gg-file-icon--pdf" />;
  return                                       <File size={18} className="gg-file-icon gg-file-icon--generic" />;
}

function fmtSize(bytes) {
  if (!bytes) return "–";
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function relTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Upload Zone ──────────────────────────────────────────────────
function UploadZone({ projectId, onUploaded }) {
  const fileRef   = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const upload = useCallback(async (files) => {
    if (!files.length) return;
    setUploading(true);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("files", f));
    if (projectId) form.append("projectId", projectId);
    try {
      const res = await apiClient.post("/api/files/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`${res.data.uploaded?.length ?? files.length} file(s) uploaded.`);
      onUploaded?.();
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [projectId, onUploaded, toast]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    upload(e.dataTransfer.files);
  };

  return (
    <div
      className={`gg-upload-zone${dragging ? " gg-upload-zone--active" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && fileRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
      aria-label="Upload files"
    >
      <input
        ref={fileRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => upload(e.target.files)}
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,.csv"
      />
      {uploading ? (
        <>
          <div className="gg-dash-spinner" style={{ margin: "0 auto" }} />
          <p className="gg-upload-label">Uploading…</p>
        </>
      ) : (
        <>
          <Upload size={26} className="gg-upload-icon" />
          <p className="gg-upload-label">Drop files here or <span className="gg-upload-link">browse</span></p>
          <p className="gg-upload-hint">PNG, JPG, PDF, DOC, ZIP — up to 50 MB</p>
        </>
      )}
    </div>
  );
}

// ── File Row ─────────────────────────────────────────────────────
function FileRow({ file, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${file.originalName || file.filename}"?`)) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/api/files/${file.id}`);
      toast.success("File deleted.");
      onDelete(file.id);
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await apiClient.get(`/api/files/${file.id}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a   = document.createElement("a");
      a.href = url;
      a.download = file.originalName || file.filename || "file";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed.");
    }
  };

  return (
    <tr className="gg-file-row">
      <td className="gg-file-name-cell">
        {fileIcon(file.mimetype)}
        <span className="gg-file-name" title={file.originalName}>{file.originalName || file.filename || "–"}</span>
      </td>
      <td className="gg-file-meta">{file.projectName || file.clientName || "—"}</td>
      <td className="gg-file-meta">{fmtSize(file.size)}</td>
      <td className="gg-file-meta">{relTime(file.createdAt || file.created_at)}</td>
      <td className="gg-file-actions">
        <button className="gg-icon-btn" title="Download" onClick={handleDownload}>
          <Download size={14} />
        </button>
        <button className="gg-icon-btn gg-icon-btn--danger" title="Delete" onClick={handleDelete} disabled={deleting}>
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}

// ── FilesPage ────────────────────────────────────────────────────
export default function FilesPage() {
  const [files, setFiles]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [projects, setProjects]   = useState([]);
  const [view, setView]           = useState("list"); // list | grid

  const loadFiles = useCallback(() => {
    setLoading(true);
    Promise.allSettled([
      apiClient.get("/api/files"),
      apiClient.get("/api/projects"),
    ]).then(([filesRes, projRes]) => {
      if (filesRes.status === "fulfilled") {
        setFiles(filesRes.value.data.files || filesRes.value.data || []);
      } else {
        setError("Failed to load files.");
      }
      if (projRes.status === "fulfilled") {
        setProjects(projRes.value.data.projects || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const filtered = files.filter((f) => {
    const name  = (f.originalName || f.filename || "").toLowerCase();
    const proj  = (f.projectId || f.project_id || "");
    const matchSearch  = !search        || name.includes(search.toLowerCase());
    const matchProject = !filterProject || proj === filterProject;
    return matchSearch && matchProject;
  });

  const images     = filtered.filter((f) => f.mimetype?.startsWith("image/"));
  const documents  = filtered.filter((f) => !f.mimetype?.startsWith("image/"));

  return (
    <PageWrapper
      title="Files"
      description="Central asset library for all client and project files."
      actions={
        <div className="gg-files-toolbar">
          <div className="gg-search-box">
            <Search size={14} className="gg-search-icon" />
            <input
              className="gg-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
            />
            {search && <button className="gg-search-clear" onClick={() => setSearch("")}><X size={12} /></button>}
          </div>
          {projects.length > 0 && (
            <select
              className="gg-select"
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          )}
          <div className="gg-view-toggle">
            <button
              className={`gg-view-btn${view === "list" ? " active" : ""}`}
              onClick={() => setView("list")}
              title="List view"
            >☰</button>
            <button
              className={`gg-view-btn${view === "grid" ? " active" : ""}`}
              onClick={() => setView("grid")}
              title="Grid view"
            >⊞</button>
          </div>
        </div>
      }
    >
      {/* ── Upload Zone ──────────────────────────────────────── */}
      <UploadZone projectId={filterProject || null} onUploaded={loadFiles} />

      {loading ? (
        <div className="gg-empty" style={{ marginTop: 24 }}>Loading files…</div>
      ) : error ? (
        <div className="gg-empty" style={{ marginTop: 24 }}>{error}</div>
      ) : filtered.length === 0 ? (
        <div className="gg-empty" style={{ marginTop: 24 }}>
          <Paperclip size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p>{search || filterProject ? "No files match your filters." : "No files uploaded yet."}</p>
        </div>
      ) : view === "grid" ? (
        /* ── Grid View ─────────────────────────────────────── */
        <>
          {images.length > 0 && (
            <div className="gg-files-section">
              <p className="gg-files-section-label">
                <Image size={14} /> Images ({images.length})
              </p>
              <div className="gg-files-grid">
                {images.map((f) => (
                  <div key={f.id} className="gg-file-grid-card">
                    <div className="gg-file-grid-thumb">
                      <img
                        src={f.url || f.fileUrl}
                        alt={f.originalName}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                    <p className="gg-file-grid-name">{f.originalName || "Image"}</p>
                    <p className="gg-file-grid-meta">{fmtSize(f.size)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {documents.length > 0 && (
            <div className="gg-files-section">
              <p className="gg-files-section-label">
                <Folder size={14} /> Documents ({documents.length})
              </p>
              <div className="gg-files-grid">
                {documents.map((f) => (
                  <div key={f.id} className="gg-file-grid-card">
                    <div className="gg-file-grid-thumb gg-file-grid-thumb--doc">
                      {fileIcon(f.mimetype)}
                    </div>
                    <p className="gg-file-grid-name">{f.originalName || f.filename}</p>
                    <p className="gg-file-grid-meta">{fmtSize(f.size)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* ── List View ─────────────────────────────────────── */
        <div className="gg-table-wrap" style={{ marginTop: 16 }}>
          <table className="gg-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Project / Client</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <FileRow
                  key={f.id}
                  file={f}
                  onDelete={(id) => setFiles((prev) => prev.filter((x) => x.id !== id))}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}
