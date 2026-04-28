/**
 * client/src/hooks/useNotifications.js
 * Engineering pattern: Debounce mark-all-read (500 ms), badge count management.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import apiClient from "../services/apiClient";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);
  const debounceRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await apiClient.get("/api/notifications");
      const items = resp.data.notifications || [];
      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error("[useNotifications] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = useCallback(async (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await apiClient.put(`/api/notifications/${notifId}/read`);
    } catch (err) {
      // Revert on failure
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // Debounce: only call the API 500 ms after the last invocation
  const markAllRead = useCallback(() => {
    // Optimistic UI
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        await apiClient.put("/api/notifications/read-all");
      } catch (err) {
        fetchNotifications(); // revert
      }
    }, 500);
  }, [fetchNotifications]);

  return { notifications, unreadCount, loading, markRead, markAllRead, refetch: fetchNotifications };
}
