import { counterReducer } from '@/app/store/client/features/counter/counterSlice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE,
} from 'redux-persist'
import { customTableReducer } from './features/customTable/customTableSlice'
import { departmentCreateInfoReducer } from './features/department_create/departmentCreateInfoSlice'
import { assignCreateReducer } from './features/engineer_assign/assignCreateSlice'
import { engineerAssignReducer } from './features/engineer_assign/engineerAssignSlice'
import { modalOpenReducer } from './features/modal/modalSlice'
import { projectAssignDataSliceReducer } from './features/project_assign/projectAssignDataSlice'
import { projectAssignSliceReducer } from './features/project_assign/projectAssignSlice'
import { projectCreateInfoReducer } from './features/project_create/projectCreateInfoSlice'
import { projectCreateJPOrderReducer } from './features/project_create/projectCreateJPOrderSlice'
import { projectCreateMMOrderReducer } from './features/project_create/projectCreateMMOrderSlice'
import { projectCreateSesInfoReducer } from './features/project_create/projectCreateSesInfoSlice'
import { collapsibleReducer } from './features/sidebar/collapsibleSlice'
import persistConfig from './features/sidebar/persistConfig'
import { urlTrackReducer } from './features/url_track/urlTrackSlice'
import { emailReducer } from './features/email/email'

const rootReducer = combineReducers({
    collapsible: collapsibleReducer,
    counter: counterReducer,
    engineerAssign: engineerAssignReducer,
    assignCreate: assignCreateReducer,
    modalOpen: modalOpenReducer,
    projectAssign: projectAssignSliceReducer,
    projectAssignData: projectAssignDataSliceReducer,
    projectCreateInfo: projectCreateInfoReducer,
    projectCreateSesInfo: projectCreateSesInfoReducer,
    projectCreateJPOrderInfo: projectCreateJPOrderReducer,
    projectCreateMMOrderInfo: projectCreateMMOrderReducer,
    customTable: customTableReducer,
    departmentCreateInfo: departmentCreateInfoReducer,
    urlTrack: urlTrackReducer,
    email: emailReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
})

const persistor = persistStore(store)

export { store, persistor }
