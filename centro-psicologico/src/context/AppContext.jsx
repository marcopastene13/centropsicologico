import React, { createContext, useReducer } from 'react';

export const AppContext = createContext();

const initialState = {
  currentReservation: {
    professional: null,
    date: null,
    slot: null,
    modality: null,
    formData: {
      nombre: '',
      rut: '',
      correo: '',
      telefono: '',
      detalles: ''
    }
  },
  user: null,
  isLoading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RESERVATION':
      return {
        ...state,
        currentReservation: {
          ...state.currentReservation,
          ...action.payload
        }
      };
    case 'SET_FORM_DATA':
      return {
        ...state,
        currentReservation: {
          ...state.currentReservation,
          formData: {
            ...state.currentReservation.formData,
            ...action.payload
          }
        }
      };
    case 'RESET_RESERVATION':
      return {
        ...state,
        currentReservation: initialState.currentReservation
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}