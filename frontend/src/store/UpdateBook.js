import bookData from "../BookData/bookData.json"

function shuffleArrayInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export const uploadBook = () => {
    const book = bookData.Books[Math.floor(Math.random() * bookData.Books.length)]
    return {
        type: "UPLOAD_BOOK",
        payload: book
    }
}

export const getBook = () => {
    return {
        type: "GET_BOOK"
    }
}

const initialState = {
    data: null
}

// export const getOneBook = () => async (dispatch) => {
//     shuffleArrayInPlace(bookData.Books)
//     const book = bookData.Books[Math.floor(Math.random() * bookData.Books.length)]
//     await dispatch(getData(book))
// }

const dataReducer = (state = initialState, action) => {
    let newState = {};
    switch (action.type) {
        case 'UPLOAD_BOOK':
            newState = action.payload
            return newState;
        case 'GET_BOOK':
            return newState
        default:
            return state;
    }
};

export default dataReducer
