import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { AppState, CaptchaStage } from "../models/captcha";

@Injectable({ providedIn: 'root' })
export class CaptchaService {
    private readonly STORAGE_KEY = 'challenge_state'
    private readonly platformId = inject(PLATFORM_ID);

    private appState = signal<AppState>(this.loadState());

    constructor() {
        effect(() => {
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.appState()))
            }
        })
    }

    readonly currentStage = computed(() => {
        const state = this.appState();
        return state.stages[state.currentStageId] || state.stages[0]
    });

    readonly isCompleted = computed(() => this.appState().isCompleted);

    readonly stages = computed(() => this.appState().stages);

    readonly currentStageId = computed(() => this.appState().currentStageId);

    readonly totalStages = computed(() => this.appState().stages.length);

    readonly startTime = computed(() => this.appState().startTime);

    readonly isFirstStage = computed(() => this.appState().currentStageId === 0);

    readonly isLastStage = computed(() =>
        this.appState().currentStageId === this.appState().stages.length - 1
    );

    readonly currentStageAnswered = computed(() =>
        this.currentStage().userAnswer !== null
    );

    readonly allStagesAnswered = computed(() =>
        this.appState().stages.every(s => s.userAnswer !== null)
    );

    submitAnswer(stageId: number, answer: any): void {
        this.appState.update(state => {
            const stages = state.stages.map(stage => {
                if (stage.id !== stageId) return stage;

                let isCorrect = false;
                if (stage.type === 'operation') {
                    isCorrect = Number(answer) === stage.correctAnswers;
                } else if (stage.type === 'text') {
                    isCorrect = answer === stage.correctAnswers;
                } else if (stage.type === 'image') {
                    const sorted = [...answer].sort();
                    const correctSorted = [...stage.correctAnswers].sort();
                    isCorrect = sorted.length === correctSorted.length
                        && sorted.every((v: number, i: number) => v === correctSorted[i]);
                }

                return { ...stage, userAnswer: answer, isCorrect };
            });
            return { ...state, stages };
        });
    }

    nextStage(): boolean {
        const state = this.appState();
        if (state.currentStageId < state.stages.length - 1) {
            this.appState.update(s => ({
                ...s,
                currentStageId: s.currentStageId + 1
            }));
            return true;
        }
        return false;
    }

    previousStage(): boolean {
        const state = this.appState();
        if (state.currentStageId > 0) {
            this.appState.update(s => ({
                ...s,
                currentStageId: s.currentStageId - 1
            }));
            return true;
        }
        return false;
    }

    completeChallenge(): void {
        this.appState.update(s => ({
            ...s,
            isCompleted: true
        }));
    }

    resetState(): void {
        this.appState.set({
            currentStageId: 0,
            stages: this.generateRandomStages(),
            startTime: new Date(),
            isCompleted: false
        });
    }

    getTimeTaken(): string {
        const start = new Date(this.appState().startTime);
        const now = new Date();
        const diffMs = now.getTime() - start.getTime();
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${seconds}s`;
    }

    loadState(): AppState {
        if (isPlatformBrowser(this.platformId)) {
            const saved_state = localStorage.getItem(this.STORAGE_KEY);
            if (saved_state) {
                return JSON.parse(saved_state);
            }
        }

        return {
            currentStageId: 0,
            stages: this.generateRandomStages(),
            startTime: new Date(),
            isCompleted: false
        };
    }

    private generateRandomStages(): CaptchaStage[] {
        return [
            this.createMathStage(0),
            this.createTextStage(1),
            this.createImagesStage(2)
        ]
    }

    private createMathStage(id: number): CaptchaStage {
        const n1 = Math.floor(Math.random() * 20) + 1;
        const n2 = Math.floor(Math.random() * 20) + 1;

        const operators = ['+', '-', '*'];
        const selectedOp = operators[Math.floor(Math.random() * operators.length)];

        let result: number = 0;
        switch (selectedOp) {
            case '+':
                result = n1 + n2;
                break;
            case '-':
                result = n1 - n2;
                break;
            case '*':
                result = n1 * n2;
                break;
        }

        return {
            id,
            title: "Math Challenge",
            type: 'operation',
            instructions: `Solve this math operation`,
            puzzle: `${n1} ${selectedOp} ${n2}`,
            correctAnswers: result,
            userAnswer: null,
            isCorrect: false
        }
    }

    private createTextStage(id: number): CaptchaStage {
        const alphab = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';

        for (let i = 0; i < 5; i++) {
            const index = Math.floor(Math.random() * alphab.length)
            result += alphab[index]
        }

        return {
            id,
            title: "Text Challenge",
            type: "text",
            instructions: `Enter this Text`,
            puzzle: result,
            correctAnswers: result,
            userAnswer: null,
            isCorrect: false,
        }
    }

    private createImagesStage(id: number): CaptchaStage {
        const cats = [
            '/assets/cats/0.jpg',
            '/assets/cats/1.jpg',
            '/assets/cats/2.jpg'
        ]

        const dogs = [
            '/assets/dogs/0.jpg',
            '/assets/dogs/1.jpg',
            '/assets/dogs/2.jpg'
        ]

        let images = [];
        const result: number[] = [];

        for (let i = 0; i < 9; i++) {
            const isCat = Math.random() < 0.5;

            if (isCat) {
                const index = Math.floor(Math.random() * cats.length);
                images.push({
                    id: i,
                    imageUrl: cats[index],
                    isCat: isCat
                })
                result.push(i)
            } else {
                const index = Math.floor(Math.random() * dogs.length);
                images.push({
                    id: i,
                    imageUrl: dogs[index],
                    isCat: isCat
                })
            }
        }

        return {
            id,
            title: "Images Challenge",
            type: "image",
            instructions: 'Select only the Cats images',
            puzzle: images,
            correctAnswers: result,
            userAnswer: null,
            isCorrect: false,
        }
    }
}
