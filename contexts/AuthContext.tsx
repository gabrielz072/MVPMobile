import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { auth, db } from '@/lib/firebase';

export type UserRole = 'admin' | 'user';

type AuthContextValue = {
  user: User | null;
  userName: string | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setUserName(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const profile = await getDoc(doc(db, 'users', nextUser.uid));
      const profileData = profile.data();
      setUserName(profileData?.name || nextUser.email || null);
      setRole(profileData?.role === 'admin' ? 'admin' : 'user');
      setLoading(false);
    });
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function register(name: string, email: string, password: string) {
    const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password);

    await setDoc(doc(db, 'users', credentials.user.uid), {
      name: name.trim(),
      email: email.trim(),
      role: 'user',
    });
  }

  return (
    <AuthContext.Provider value={{ user, userName, role, loading, login, register, logout: () => signOut(auth) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');

  return context;
}