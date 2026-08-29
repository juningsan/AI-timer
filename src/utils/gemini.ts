export async function generateRefreshSuggestions(): Promise<string> {
    try {
        const response = await fetch('/api/refresh-suggestion');
        const data = await response.json();
        return data.suggestion;
    }
    catch (error) {
        console.error(error);
        return "エラが発生しました";
    }
}