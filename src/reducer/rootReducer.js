const initialState = {
    userDetails: [],
    usersTodo: []
};
export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "USERDETAILS":
            return {
                ...state, userDetails: action.userDetails
            }
        case "ONSUBSCRIBE":
            return {
                ...state, usersTodo: action.usersTodo
            }
        case "USERSTODOLIST":
            return {
                ...state, usersTodoList: action.usersTodoList
            }
        case "CREATEDTODO":
            return {
                ...state, createdTodo: action.createdTodo
            }
        case "UPDATEDTODO":
            return {
                ...state, updatedTodo: action.updatedTodo
            }
        case "COMPLETEDTODO":
            return {
                ...state, completedTodo: action.completedTodo
            }
        default:
            return state
    }
};


