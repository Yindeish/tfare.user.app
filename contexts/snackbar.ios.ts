import React, { createContext, ReactNode, useContext, useState } from 'react';
import Snackbar from '@/components/shared/snackbar';

interface SnackbarContextType {
  showSnackbar: (message: string, duration?: number) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({children}:{children: ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(3000); // Default duration is 3 seconds

  const showSnackbar = (message: string, duration: number = 3000) => {
    setMessage(message);
    setDuration(duration);
    setVisible(true);
    setTimeout(() => hideSnackbar(), duration); // Automatically hide after the duration
  };

  const hideSnackbar = () => {
    setVisible(false);
    setMessage('');
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, hideSnackbar }}>
      {children}
      {visible && <Snackbar message={message} />}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
