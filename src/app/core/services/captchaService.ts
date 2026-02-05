import { Injectable, signal } from "@angular/core";
import { AppState, CaptchaStage } from "../models/captcha";

Injectable({ providedIn: 'root' })
export class CaptchaService {
    private readonly STORAGE_KEY = 'challenge_state'

    public appState = signal<AppState>(this.loadState())

    loadState(): AppState {
        const saved_state = localStorage.getItem(this.STORAGE_KEY);
        if (saved_state) {
            return JSON.parse(saved_state);
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
            '/public/assets/cats/0.jpg',
            '/public/assets/cats/1.jpg',
            '/public/assets/cats/2.jpg'
        ]

        const dogs = [
            '/public/assets/dogs/0.jpg',
            '/public/assets/dogs/1.jpg',
            '/public/assets/dogs/2.jpg'
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