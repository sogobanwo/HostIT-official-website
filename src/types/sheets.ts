export interface SheetResponse {
  headers: string[];
  data: Record<string, string>[];
  totalResponses: number;
}

export interface SheetError {
  error: string;
  details?: string;
}

export interface FormResponse {
  [key: string]: string;
}

export interface UseGoogleSheetDataReturn {
  data: FormResponse[];
  headers: string[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}