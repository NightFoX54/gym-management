import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TrainerDataContext = createContext();

export function TrainerDataProvider({ children }) {
  const [trainerData, setTrainerData] = useState({
    id: 3,
    fullName: 'Loading...',
    email: 'loading@example.com',
    phone: '',
    profilePhoto: null,
    registrationDate: '',
    specialization: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrainerData = async () => {
    setLoading(true);
    try {
      // Hardcoded trainerId for now - should come from authentication
      const trainerId = 3;
      const response = await axios.get(`http://localhost:8080/api/trainer/${trainerId}/profile`);
      
      if (response.status === 200) {
        setTrainerData(response.data);
        setError(null);
      } else {
        setError('Failed to load trainer data');
      }
    } catch (err) {
      console.error('Error fetching trainer data:', err);
      setError('Error fetching trainer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const updateTrainerData = async (updates) => {
    try {
      // Assuming the user is already logged in and trainer ID is 3
      const trainerId = 3;
      const response = await axios.put(`http://localhost:8080/api/trainer/${trainerId}/profile`, updates);
      
      if (response.status === 200) {
        setTrainerData(prevData => ({ ...prevData, ...response.data }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating trainer data:', err);
      return false;
    }
  };

  return (
    <TrainerDataContext.Provider value={{ 
      trainerData, 
      loading, 
      error, 
      refreshTrainerData: fetchTrainerData,
      updateTrainerData
    }}>
      {children}
    </TrainerDataContext.Provider>
  );
}

export function useTrainerData() {
  return useContext(TrainerDataContext);
}
