
// src/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState, AppDispatch } from '../store/index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Custom hooks for common operations
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  
  return {
    ...auth,
    dispatch,
  };
};

export const useUser = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth);

  return {
    ...user,
    dispatch,
  };
};
