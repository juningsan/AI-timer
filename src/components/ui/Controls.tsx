import { Button } from '@/components/ui/button';

interface ControlsProps {
    onStart: () => void;
    onReset: () => void;
    onToggleMode: () => void;
    isRunning: boolean;
}

export default function Controls({ onStart, onReset, isRunning, onToggleMode }: ControlsProps) {
    return (
        <div className='flex flex-col items-center gap-4'>
            <Button variant="default" size='lg' onClick={onStart}>
                {isRunning ? '停止' : '開始'}
            </Button>
            <Button variant="secondary" size='lg' onClick={onReset}>
                リセット
            </Button>
            <Button variant="ghost" size='lg'
                onClick={onToggleMode}
                className='text-muted-foreground hover:text-foreground'
                >
                モード切り替え
            </Button>
        </div>
    )
}