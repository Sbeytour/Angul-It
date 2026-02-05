import { Injectable } from "@angular/core";
import { AppState, CaptchaStage } from "../models/captcha";
import { single } from "rxjs";

Injectable({ providedIn: 'root' })
export class CaptchaService {
    private readonly STORAGE_KEY = 'challenge_state'

    private state = single<AppState>(this.loadState())

    loadState(): AppState {
        const saved_state = localStorage.getItem(this.STORAGE_KEY);
        if (saved_state) {
            return JSON.parse(saved_state);
        }

        return {
            currentStageId: 0,
            stages: this.generateRandomStages(),
            userAnswers: [],
            isStarted: false,
            isCompleted: false
        };
    }

    private generateRandomStages(): CaptchaStage[] {
        return [
            this.createMathStage(0)
        ]
    }

    private createMathStage(id: number): CaptchaStage {
        const n1 = Math.floor(Math.random() * 20);
        const n2 = Math.floor(Math.random() * 20);

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
            title : "Math Challenge",
            type : 'operation',
            instructions: `What is ${n1} ${selectedOp} ${n2}`,
            correctAnswers: result
        }
    }
}