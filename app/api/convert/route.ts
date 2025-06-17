import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read the file
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet);
    
    if (type === 'backend') {
      // Backend format: single file with both languages
      const result: Record<string, Record<string, { default: string }>> = {
        en: {},
        tr: {}
      };
      
      // Process data for backend format
      for (const row of data) {
        const key = (row as any)['Key'];
        if (key && typeof key === 'string' && key.trim()) {
          // English translation
          const enValue = (row as any)['en'];
          result.en[key] = {
            default: enValue || '-'
          };
          
          // Turkish translation
          const trValue = (row as any)['tr'];
          result.tr[key] = {
            default: trValue || '-'
          };
        }
      }
      
      const combinedJson = JSON.stringify(result, null, 2);
      
      return NextResponse.json({
        combined: combinedJson
      });
      
    } else {
      // App UI format: separate files for each language
      const trData: Record<string, any> = {};
      const enData: Record<string, any> = {};
      
      // Skip the first row and process data
      for (let i = 1; i < data.length; i++) {
        const row = data[i] as any;
        const key = row['Key'];
        const hasLinks = row['HAS_LINKS'];
        
        // Skip if key is undefined or null
        if (!key) continue;
        
        // Extract values, replace undefined/null with "-"
        const trText = row['tr_TR'] || '-';
        const enText = row['en_INT'] || '-';
        
        // Process keys without links (HAS_LINKS = 0)
        if (hasLinks === 0) {
          trData[key] = { default: trText };
          enData[key] = { default: enText };
        }
        // Process keys with links (HAS_LINKS = 1)
        else {
          const trLinkText = row['tr_TR_Link_Text'] || '-';
          const trLinkUrl = row['tr_TR_Link_URL'] || '';
          
          const enLinkText = row['en_INT_Link_Text'] || '-';
          const enLinkUrl = row['en_INT_Link_URL'] || '';
          
          trData[key] = {
            default: trText,
            links: [
              {
                '%1$s': trLinkText,
                link: trLinkUrl
              }
            ]
          };
          
          enData[key] = {
            default: enText,
            links: [
              {
                '%1$s': enLinkText,
                link: enLinkUrl
              }
            ]
          };
        }
      }
      
      // Convert to JSON strings
      const trJson = JSON.stringify(trData, null, 2);
      const enJson = JSON.stringify(enData, null, 2);
      
      return NextResponse.json({
        tr: trJson,
        en: enJson
      });
    }
    
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
} 