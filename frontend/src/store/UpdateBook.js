import bookData from "../BookData/bookData.json"

function shuffleArrayInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const getData = (data) => {
    return {
        type: "GET_DATA",
        payload: data
    }
}

const initialState = {
    data: null
}

export const getOneBook = () => async (dispatch) => {
    shuffleArrayInPlace(bookData.Books)
    const book = bookData.Books[Math.floor(Math.random() * bookData.Books.length)]
    dispatch(getData(book))
    return book
}

const dataReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case 'GET_DATA':
            newState[action.payload.title] = action.payload
            return newState;
        default:
            return state;
    }
};

export default dataReducer
