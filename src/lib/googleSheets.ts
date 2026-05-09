export async function sendToGoogleSheets(sheetName: string, data: any) {
    const url = "https://script.google.com/macros/s/AKfycbyuIH97wIqmlMz8Z9qrk7Pk6VWK-1s6b3m4tE_VaIYeE8G1QE8_1Yo1FqZgI0G3mu7Z/exec";

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
    const url = "https://script.google.com/macros/s/AKfycbyuIH97wIqmlMz8Z9qrk7Pk6VWK-1s6b3m4tE_VaIYeE8G1QE8_1Yo1FqZgI0G3mu7Z/exec";

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
