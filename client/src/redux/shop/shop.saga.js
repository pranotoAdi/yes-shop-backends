import { takeLatest, call, put, all } from 'redux-saga/effects';

import { 
    firestore, 
    convertCollectionSnapshotToMap 
} from '../../firebase/firebase.utils'

import {
    fetchCollectionsSuccess,
    fetchCollectionsFailure
} from './shop.actions';

import ShopActionTypes from './shop.types';

export function* fetchCollections() {
    try {
        const collectionRef = firestore.collection('collections')
        const snapshot = yield collectionRef.get();
        const collectionsMap = yield call (convertCollectionSnapshotToMap, snapshot)
        yield put (fetchCollectionsSuccess(collectionsMap));
    } catch (error) {
        yield put(fetchCollectionsFailure(error.message));
     }
    

   
    // fetch ('https://firestore.googleapis.com/v1/projects/my-shop-8d22f/databases/(default)/documents/collections')
    // .then(response => response.json());
    // .then(collections => console.log(collections));

    // collectionRef.get().then(snapshot => {
    //    const collectionsMap = convertCollectionSnapshotToMap(snapshot);
    //    dispatch(fetchCollectionsSuccess(collectionsMap));
    // }).catch(error => dispatch(fetchCollectionsFailure(error.Message)));
}

export function* fetchCollectionsStart() {
    yield takeLatest(
        ShopActionTypes.FETCH_COLLECTIONS_START, 
        fetchCollections
        );
}

export function* shopSagas() {
    yield all ([call(fetchCollectionsStart)])
}