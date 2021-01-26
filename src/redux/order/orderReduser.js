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
const getOrder = (state = {}, {type, payload}) => {
    switch(type) {
        case Types.FETCH_ORDER_INFO:
        return payload

        default:
            return state
    }
}

const getInfoPassangers =( state= {}, {type, payload}) => {
    switch(type){
        case Types.SEND_INFO_PASSANGER:
            return payload

            default:
                return state
    }
}

// const getInfoPassangers =( state= [], {type, payload}) => {
//     switch(type){
//         case Types.SEND_INFO_PASSANGER:
//             return [...state, payload]

//             default:
//                 return state
//     }
// }

export const orderReduser = combineReducers({
    isVisibleOrder: changeIsVisibleOrder,
    order: getOrder,
    infoPassangers: getInfoPassangers,
    // infoPassangers: getInfoPassangers,
}) 