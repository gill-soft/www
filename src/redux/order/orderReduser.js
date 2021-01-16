import { Types} from '../actionsTypes'
import { combineReducers } from "redux";


const changeIsVisibleOrder = (state=false, {type, payload}) => {
    switch (type) {
        case Types.CHANGE_IS_VISIBLE_ORDER:
            return payload
    
        default:
            return state
    }
}

export const orderReduser = combineReducers({
    isVisibleOrder: changeIsVisibleOrder
}) 