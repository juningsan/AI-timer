interface TimerDisplayProps {
    seconds: number;
    minutes: number;
    mode?: 'work' | 'break';
}

export default function TimerDisplay({ seconds, minutes, mode }: TimerDisplayProps) {
    return (
        <div className={`text-6xl font-mono font-bold font-primary text-center
            ${mode === 'work' ? 'text-red-500' : 'text-green-500'}
        `}>
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
    )
}