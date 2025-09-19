// hooks/useTeam.ts
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useUser } from '../hooks/authHook';
import { 
  fetchUserTeam, 
  fetchTeamMessages, 
  sendMessage, 
  addLocalMessage,
  setCurrentUser 
} from '../store/slices/teamSlice';
import { AppDispatch, RootState } from '../store';

export const useTeam = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useUser();
  const teamState = useSelector((state: RootState) => state.team);

  // Initialize team with current user
  const initializeTeam = useCallback((hackathonId: string) => {
    if (user) {
      dispatch(setCurrentUser(user?._id));
      dispatch(fetchUserTeam({ userId: user?._id, hackathonId }));
    }
  }, [dispatch, user]);

  const loadMessages = useCallback((teamId: string, page?: number) => {
    dispatch(fetchTeamMessages({ teamId, page }));
  }, [dispatch]);
  return {
    ...teamState,
    initializeTeam,
    loadMessages,

  };
};