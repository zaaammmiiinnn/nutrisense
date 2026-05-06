import { NextRequest, NextResponse } from 'next/server';
import { DEMO_WEEKLY_REPORT } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    const { weekData } = await request.json();
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!apiKey || !spreadsheetId) {
      await new Promise(r => setTimeout(r, 800));
      return NextResponse.json({
        success: true, mode: 'demo',
        data: {
          spreadsheetUrl: 'https://docs.google.com/spreadsheets/d/demo-spreadsheet',
          report: DEMO_WEEKLY_REPORT,
          message: 'Weekly report would be exported to Google Sheets (Demo Mode)',
          lookerStudioUrl: 'https://lookerstudio.google.com/reporting/demo-dashboard',
        },
      });
    }

    // Live Sheets API
    const report = weekData || DEMO_WEEKLY_REPORT;
    const values = [
      ['NutriSense Weekly Report', '', '', '', '', ''],
      ['Week', `${report.weekStart} - ${report.weekEnd}`, '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Metric', 'Average', 'Target', 'Status', '', ''],
      ['Calories Consumed', report.avgCaloriesConsumed, 2000, report.avgCaloriesConsumed <= 2000 ? '✅' : '⚠️'],
      ['Calories Burned', report.avgCaloriesBurned, 2200, report.avgCaloriesBurned >= 2000 ? '✅' : '⚠️'],
      ['Protein (g)', report.avgProtein, 150, report.avgProtein >= 140 ? '✅' : '⚠️'],
      ['Carbs (g)', report.avgCarbs, 200, ''],
      ['Fat (g)', report.avgFat, 67, ''],
      ['Health Score', report.avgHealthScore, 80, report.avgHealthScore >= 80 ? '✅' : '⚠️'],
    ];

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:F10?valueInputOption=USER_ENTERED&key=${apiKey}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      }
    );
    const data = await res.json();

    return NextResponse.json({
      success: true, mode: 'live',
      data: {
        spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
        report,
        sheetsResponse: data,
      },
    });
  } catch (error) {
    console.error('Sheets export error:', error);
    return NextResponse.json({ success: true, data: { report: DEMO_WEEKLY_REPORT }, mode: 'demo' });
  }
}
