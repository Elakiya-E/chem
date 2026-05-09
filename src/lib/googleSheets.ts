export async function sendToGoogleSheets(sheetName: string, data: any) {
    const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!url) {
        console.warn('GOOGLE_SCRIPT_URL not found in environment variables');
        return null;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                sheetName,
                data: {
                    ...data,
                    timestamp: new Date().toISOString()
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
        console.error('Error sending data to Google Sheets:', error);
        return null;
    }
}

export async function fetchFromGoogleSheets(sheetName: string) {
    const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!url) {
        console.warn('GOOGLE_SCRIPT_URL not found in environment variables');
        return [];
    }

    try {
        const response = await fetch(`${url}?operation=fetch&sheetName=${sheetName}`, {
            method: 'GET',
        });

        const result = await response.json();
        return result.success ? result.data : [];
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        return [];
    }
}
