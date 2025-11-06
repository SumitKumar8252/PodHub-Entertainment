import { useEffect, useState } from "react";
import api from "../utils/api";

export default function useFetch(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (!url) return;

    setLoading(true);
    setError("");

    api
      .get(url)
      .then((res) => {
        if (isMounted) setData(res.data);
      })
      .catch((e) => isMounted && setError(e.message))
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: () => {} };
}
