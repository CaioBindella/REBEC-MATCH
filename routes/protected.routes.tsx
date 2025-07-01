import { Stack } from "expo-router";

const ProtectedRoutes = () => {
    return (
        <>
            <Stack.Screen 
                name="pages/AuthorizedInitialPage" // Use o nome do arquivo da página aqui
                options={{ headerShown: false }} 
            />
        </>
    );
};

export default ProtectedRoutes;