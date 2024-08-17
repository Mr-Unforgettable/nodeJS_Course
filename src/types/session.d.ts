import 'express-session';
import { User } from '../models/user';

declare module 'express-session' {
    interface SessionData {
        user?: User,
        isLoggedIn?: boolean,
    }
}