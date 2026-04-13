import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/auth-context';

export default function AdminLayout() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
