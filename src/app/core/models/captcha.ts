export type CaptchaType = 'image' | 'text' | 'operation';

export interface CaptchaStage {
    id: number;
    title: string;
    type: CaptchaType;
    instructions: string;
    correctAnswers: any;
    selectedImages?: any[];
}

export interface UserAnswer {
    stageId: number;
    answer: any;
    isCorrect: boolean;
    time: number;
}

export interface AppState {
    currentStageId: number;
    stages: CaptchaStage[];
    userAnswers: UserAnswer[];
    isStarted: boolean;
    isCompleted: boolean;
}

export interface Result {
    stageId: number;
    title: string;
    passed: boolean;
    details: string;
}