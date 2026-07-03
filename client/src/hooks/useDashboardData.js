import { useState, useEffect } from "react";
import { getDashboard } from "../api/dashboardApi";

export function useDashboardData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const dashboard = await getDashboard();
        if (mounted) {
          setData(dashboard);
        }
      } catch (err) {
        console.error("Dashboard API error:", err);
        if (mounted) {
          setError("Dashboard data could not be loaded from the database.");
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
  }, []);

  return { data, loading, error };
}
