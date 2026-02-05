export type CaptchaType = 'image' | 'text' | 'operation';

export interface CaptchaStage {
    id: number;
    title: string;
    type: CaptchaType;
    instructions: string;
    puzzle: any;
    correctAnswers: any;
    userAnswer: any;
    isCorrect: boolean;
}

export interface AppState {
    currentStageId: number;
    stages: CaptchaStage[];
    startTime: Date;
    isCompleted: boolean;
}
