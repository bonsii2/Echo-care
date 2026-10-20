import React, { createContext, useContext, useState, useEffect } from 'react';
import { MotherProfile } from '../types';
import { StorageService, defaultProfile } from '../services/storage';

interface ProfileContextType {
  profile: MotherProfile;
  updateProfile: (updated: Partial<MotherProfile>) => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<MotherProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    StorageService.getProfile().then((saved) => {
      setProfileState(saved);
      setIsLoading(false);
    });
  }, []);

  const updateProfile = async (updatedFields: Partial<MotherProfile>) => {
    const newProfile = { ...profile, ...updatedFields };
    setProfileState(newProfile);
    await StorageService.saveProfile(newProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
