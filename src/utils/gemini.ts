export async function generateRefreshSuggestions(): Promise<string> {
    try {
        const response = await fetch('/api/refresh-suggestion');
        if (!response.ok) {
            throw new Error(`Suggestion request failed: ${response.status}`);
        }

        const data: { suggestion?: string } = await response.json();
        return data.suggestion ?? "提案を取得できませんでした";
    }
    catch (error) {
        console.error(error);
        return "エラが発生しました";
    }
}