import {
    GET_PRODUCTS_REQUEST,
    GET_PRODUCTS_FAILURE,
    GET_PRODUCTS_SUCCESS
  } from '../utils/constants';
  
  const initialState = {
    isLoading: false,
    isFailed: false,
    data: []
  };
  
  const productsReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_PRODUCTS_REQUEST:
        return { ...state, isLoading: true };
      case GET_PRODUCTS_SUCCESS:
        return {
          ...state,
          isLoading: false,
          isFailed: false,
          data: action.products
        };
      case GET_PRODUCTS_FAILURE:
        return { ...state, isFailed: true, isLoading: false };
      default:
        return state;
    }
  };
  
  export default productsReducer;