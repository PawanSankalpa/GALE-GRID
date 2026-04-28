import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useDataLoader Hook
 * Manages async data loading with skeleton delay to prevent flickering
 * 
 * @param {Function} loader - Async function that returns data
 * @param {Array} dependencies - Dependencies array for re-running loader
 * @param {number} minShowTime - Minimum time to show skeleton (ms, default: 300)
 * @returns {Object} { data, loading, error }
 * 
 * @example
 * const { data, loading } = useDataLoader(
 *   () => fetch('/api/data').then(r => r.json()),
 *   []
 * );
 */
export const useDataLoader = (loader, dependencies = [], minShowTime = 300) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!isMountedRef.current) return;

      setLoading(true);
      setError(null);
      startTimeRef.current = Date.now();

      try {
        const result = await loader();

        if (isMountedRef.current) {
          // Ensure minimum skeleton display time for UX consistency
          const elapsedTime = Date.now() - startTimeRef.current;
          const remainingTime = Math.max(0, minShowTime - elapsedTime);

          if (remainingTime > 0) {
            setTimeout(() => {
              if (isMountedRef.current) {
                setData(result);
                setLoading(false);
              }
            }, remainingTime);
          } else {
            setData(result);
            setLoading(false);
          }
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message || 'Failed to load data');
          setLoading(false);
        }
      }
    };

    loadData();
  }, dependencies);

  return { data, loading, error };
};

/**
 * useSkeletonDelay Hook
 * Prevents skeleton flashing on fast loads
 * 
 * @param {boolean} loading - Loading state
 * @param {number} threshold - Delay threshold in ms (default: 300)
 * @returns {boolean} Whether to show skeleton
 * 
 * @example
 * const showSkeleton = useSkeletonDelay(isLoading, 300);
 */
export const useSkeletonDelay = (loading, threshold = 300) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (loading) {
      // Start showing skeleton after threshold
      timeoutRef.current = setTimeout(() => {
        setShowSkeleton(true);
      }, threshold);
    } else {
      // Immediately hide skeleton when loading completes
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowSkeleton(false);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loading, threshold]);

  return showSkeleton;
};

/**
 * usePaginatedDataLoader Hook
 * Manages paginated async data loading
 * 
 * @param {Function} loader - Async function that returns paginated data
 * @param {Array} dependencies - Dependencies array
 * @param {number} minShowTime - Minimum skeleton display time (ms)
 * @returns {Object} { data, loading, error, page, setPage, hasMore }
 */
export const usePaginatedDataLoader = (loader, dependencies = [], minShowTime = 300) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const startTimeRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!isMountedRef.current) return;

      setLoading(true);
      setError(null);
      startTimeRef.current = Date.now();

      try {
        const result = await loader(page);

        if (isMountedRef.current) {
          const elapsedTime = Date.now() - startTimeRef.current;
          const remainingTime = Math.max(0, minShowTime - elapsedTime);

          const updateState = () => {
            if (isMountedRef.current) {
              setData(prev => page === 1 ? result.items : [...prev, ...result.items]);
              setHasMore(result.hasMore ?? true);
              setLoading(false);
            }
          };

          if (remainingTime > 0) {
            setTimeout(updateState, remainingTime);
          } else {
            updateState();
          }
        }
      } catch (err) {
        if (isMountedRef.current) {
          setError(err.message || 'Failed to load data');
          setLoading(false);
        }
      }
    };

    loadData();
  }, [page, ...dependencies]);

  const handleNextPage = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  return { data, loading, error, page, setPage, hasMore, onNextPage: handleNextPage };
};

/**
 * useImageLoader Hook
 * Manages image loading with fallback support
 * 
 * @param {string} src - Image source URL
 * @param {string} fallback - Fallback image URL (optional)
 * @returns {Object} { loaded, error, src: finalSrc }
 */
export const useImageLoader = (src, fallback = null) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [finalSrc, setFinalSrc] = useState(src);
  const imgRef = useRef(new Image());

  useEffect(() => {
    if (!src) return;

    setLoaded(false);
    setError(null);
    const img = imgRef.current;

    img.onload = () => setLoaded(true);
    img.onerror = () => {
      setError(true);
      if (fallback) {
        setFinalSrc(fallback);
      }
    };

    img.src = src;
  }, [src, fallback]);

  return { loaded, error, src: finalSrc };
};
