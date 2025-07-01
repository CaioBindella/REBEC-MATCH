import { Stack } from 'expo-router';
import React from 'react';

const PublicRoutes = () => {
    return (
        <>
            <Stack.Screen 
                name="pages/LoginPage" 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="index" 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="pages/VoluntaryRegisterPage" 
                options={{ headerShown: false }} 
            />
        </>
    );
};

export default PublicRoutes;