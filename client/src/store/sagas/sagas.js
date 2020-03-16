// import { call, put } from 'redux-saga/effects';
import axios from 'axios';
import { takeEvery } from 'redux-saga';

// 1. our worker saga
export function* createJwtAsync(action) {
    try {
        // trying to call our API
        // action.email
        console.log('Attempting to create jwt call via the API');
        const response = yield call(axios.post, "/getToken", {
            email: action.email
        });
        console.log(response);
        yield put ({ type: 'LOGIN_SUCCEEDED', response: response.data });

    } catch (error) {
        console.log('Request failed! User not permitted to app.');
        console.log(error);
        yield put ({ type: 'LOGIN_FAILED', message: error.message });

    }
}
// 2. our watcher saga
// Our watcher saga. spawn asynchronous task on each ACTION
export default function* watchCreateJwt() {
    console.log('redux-saga is running the jwt create action listener...');
    yield takeEvery('jwt create action listener', createJwtAsync);
}

// 3. our root saga
// single entry point to start sagas at once.
export default function* rootSaga() {
    yield [
        watchCreateJwt(),
    ]
}