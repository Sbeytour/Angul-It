import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Captcha } from './components/captcha/captcha';
import { Result } from './components/result/result';
import { resultGuard } from './core/guards/resultGuard';
import { captchaGuard } from './core/guards/captchaGuard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: 'challenges',
        component: Captcha,
        canActivate: [captchaGuard]
    },
    {
        path: 'result',
        component: Result,
        canActivate: [resultGuard]
    }
];
