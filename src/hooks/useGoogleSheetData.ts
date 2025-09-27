import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { FormResponse, UseGoogleSheetDataReturn, SheetResponse, SheetError } from '../types/sheets';

export const useGoogleSheetData = (
  sheetId: string | null,
  range: string = 'Form Responses 1'
): UseGoogleSheetDataReturn => {
  const [data, setData] = useState<FormResponse[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    if (!sheetId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ range });
      const response = await fetch(`/api/sheets/${sheetId}?${params}`);
      
      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        toast.error(errorMessage);
        setError(errorMessage);
        return;
      }

      const result: SheetResponse | SheetError = await response.json();
      
      if ('error' in result) {
        const errorMessage = typeof result.error === 'string' ? result.error : 'Unknown error occurred';
        toast.error(errorMessage);
        setError(errorMessage);
        return;
      }

      setHeaders(result.headers || []);
      setData(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(errorMessage);
      setError(errorMessage);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [sheetId, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, headers, loading, error, refetch: fetchData };
};