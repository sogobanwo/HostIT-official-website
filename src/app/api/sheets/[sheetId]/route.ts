import { SheetError, SheetResponse } from '@/types/sheets';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

interface RouteParams {
  params: {
    sheetId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SheetResponse | SheetError>> {
  const { sheetId } = params;
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'Form Responses 1';

  if (!sheetId) {
    return NextResponse.json(
      { error: 'Sheet ID is required' },
      { status: 400 }
    );
  }

  let credentials: any;

  try {
    // Try environment variables first (for production)
    if (process.env.GOOGLE_SHEETS_PRIVATE_KEY && process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
      credentials = {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    } else {
      // Fallback to credentials.json file (for development)
      const credentialsPath = path.join(process.cwd(), 'credentials.json');
      
      if (!fs.existsSync(credentialsPath)) {
        console.error('credentials.json file not found at:', credentialsPath);
        return NextResponse.json(
          { error: 'Google Sheets API configuration error: credentials.json file not found and environment variables not set' },
          { status: 500 }
        );
      }

      try {
        const credentialsFile = fs.readFileSync(credentialsPath, 'utf8');
        credentials = JSON.parse(credentialsFile);
      } catch (parseError) {
        console.error('Error parsing credentials.json:', parseError);
        return NextResponse.json(
          { error: 'Google Sheets API configuration error: Invalid credentials.json format' },
          { status: 500 }
        );
      }
    }

    // Validate required fields in credentials
    if (!credentials.client_email || !credentials.private_key) {
      console.error('Missing required fields in credentials.json');
      return NextResponse.json(
        { error: 'Google Sheets API configuration error: Missing client_email or private_key in credentials.json' },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Add debugging information
    console.log('Attempting to access sheet:', sheetId);
    console.log('Range:', range);
    console.log('Service account email:', credentials.client_email);

    // First, try to get sheet metadata to verify access
    try {
      console.log('Testing sheet access with metadata request...');
      const metadataResponse = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
        fields: 'sheets.properties'
      });
      
      console.log('Sheet metadata retrieved successfully');
      console.log('Available sheets:', metadataResponse.data.sheets?.map(sheet => sheet.properties?.title));
      
      // Check if the requested range/sheet exists
      const sheetNames = metadataResponse.data.sheets?.map(sheet => sheet.properties?.title) || [];
      const requestedSheetName = range.split('!')[0]; // Extract sheet name from range
      
      if (!sheetNames.includes(requestedSheetName)) {
        return NextResponse.json(
          { 
            error: 'Sheet not found', 
            details: `Sheet "${requestedSheetName}" not found. Available sheets: ${sheetNames.join(', ')}`,
            availableSheets: sheetNames,
            requestedSheet: requestedSheetName
          },
          { status: 404 }
        );
      }
      
    } catch (metadataError) {
      console.error('Failed to get sheet metadata:', metadataError);
      
      // If we can't even get metadata, it's likely a permission issue
      if (metadataError && typeof metadataError === 'object' && 'code' in metadataError) {
        const gaxiosError = metadataError as any;
        
        if (gaxiosError.code === 403) {
          return NextResponse.json(
            { 
              error: 'Permission denied', 
              details: `The service account "${credentials.client_email}" does not have access to this Google Sheet. Please share the sheet with this email address and grant "Viewer" permissions.`,
              serviceAccountEmail: credentials.client_email,
              sheetId: sheetId,
              instructions: [
                "1. Open the Google Sheet",
                "2. Click the 'Share' button",
                "3. Add this email: " + credentials.client_email,
                "4. Set permissions to 'Viewer'",
                "5. Click 'Send'"
              ]
            },
            { status: 403 }
          );
        }
        
        if (gaxiosError.code === 404) {
          return NextResponse.json(
            { 
              error: 'Sheet not found', 
              details: 'The Google Sheet with this ID does not exist or is not accessible',
              sheetId: sheetId
            },
            { status: 404 }
          );
        }
      }
      
      // Re-throw the error to be handled by the main catch block
      throw metadataError;
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'No data found' },
        { status: 404 }
      );
    }

    const [headers, ...dataRows] = rows;
    const formattedData = dataRows.map((row: string[]) => {
      const obj: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return NextResponse.json({
      headers,
      data: formattedData,
      totalResponses: dataRows.length
    });

  } catch (error) {
    console.error('Error fetching sheet data:', error);
    
    // Enhanced error handling for specific Google Sheets API errors
    if (error && typeof error === 'object' && 'code' in error) {
      const gaxiosError = error as any;
      
      if (gaxiosError.code === 400) {
        return NextResponse.json(
          { 
            error: 'Invalid request to Google Sheets API', 
            details: 'Please check that the sheet ID is correct and the range format is valid (e.g., "Sheet1" or "Sheet1!A1:Z100")',
            sheetId,
            range
          },
          { status: 400 }
        );
      }
      
      if (gaxiosError.code === 403) {
        return NextResponse.json(
          { 
            error: 'Permission denied accessing Google Sheet', 
            details: 'The service account does not have access to this sheet. Please share the sheet with the service account email: ' + (credentials?.client_email || 'unknown'),
            serviceAccountEmail: credentials?.client_email
          },
          { status: 403 }
        );
      }
      
      if (gaxiosError.code === 404) {
        return NextResponse.json(
          { 
            error: 'Google Sheet not found', 
            details: 'The specified sheet ID does not exist or is not accessible',
            sheetId
          },
          { status: 404 }
        );
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch sheet data', details: errorMessage },
      { status: 500 }
    );
  }
}