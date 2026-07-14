import { useCallback, useEffect, useState } from "react";
import { getCurrentUser, getStudentDashboard } from "../services/storage";

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const user = getCurrentUser();
        const dashboard = getStudentDashboard(user?.email);
        if (mounted) {
          setData(dashboard);
        }
      } catch (err) {
        console.error("Dashboard storage error:", err);
        if (mounted) {
          setError("Dashboard data could not be loaded from localStorage.");
          setData(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [requestVersion]);

  return { data, loading, error, retry };
}
