export async function playNotificationSound() {
    try {
        const audio = new Audio('/notification.mp3');
        audio.volume = 0.3;
        await audio.play();

        return new Promise<void>((resolve) => {
            audio.onended = () => {
                resolve();
            }
        });
    } catch (error) {
        console.error('再生失敗しました:', error);
    }


}