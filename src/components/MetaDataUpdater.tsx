import { useEffect } from 'react';

interface MetaDataUpdaterProps {
    minutes: number;
    seconds: number;
    mode: 'work' | 'break';
}

export default function MetaDataUpdater({minutes, seconds, mode} : MetaDataUpdaterProps) {
    useEffect(() => {
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const modeString = mode === 'work' ? '作業' : '休憩';
        document.title = `${timeString} ${modeString} - AI Pomodoro Timer`;
    }, [minutes, seconds, mode]);

    return null;
}