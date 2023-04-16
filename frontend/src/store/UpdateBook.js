export const updateData = (newData) => {
    return {
        type: 'UPDATE_DATA',
        payload: newData
    }
}

const initialState = {
    data: null
}

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_DATA':
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;
    }
};

export default dataReducer;
