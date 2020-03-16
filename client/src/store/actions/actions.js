import { userConstants } from './actionTypes';

export function checkUser() {
    return { type: userConstants.LOGIN_REQUEST, email };
}