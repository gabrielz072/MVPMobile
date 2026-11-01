
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import * as FileSystem from 'expo-file-system/legacy';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { auth, db } from '@/lib/firebase';

export type UserRole = 'admin' | 'user';

type AuthContextValue = {
  user: User | null;
  userName: string | null;
  photoURL: string | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (name: string, photoUri?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setUserName(null);
        setPhotoURL(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await getDoc(doc(db, 'users', nextUser.uid));
        const profileData = profile.data();

        setUserName(
          profileData?.name || nextUser.displayName || nextUser.email || null
        );

        const localPhotoPath =
          `${FileSystem.documentDirectory}profile-${nextUser.uid}.jpg`;

        const photoInfo = await FileSystem.getInfoAsync(localPhotoPath);

        setPhotoURL(photoInfo.exists ? localPhotoPath : null);

        setRole(profileData?.role === 'admin' ? 'admin' : 'user');
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setUserName(nextUser.displayName || nextUser.email || null);
        setPhotoURL(null);
        setRole('user');
      } finally {
        setLoading(false);
      }
    });
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function register(name: string, email: string, password: string) {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    await setDoc(doc(db, 'users', credentials.user.uid), {
      name: name.trim(),
      email: email.trim(),
      role: 'user',
      photoURL: null,
    });

    await updateProfile(credentials.user, {
      displayName: name.trim(),
    });

    setUserName(name.trim());
  }

  async function updateUserProfile(name: string, photoUri?: string) {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('Nenhum usuário está autenticado.');
    }

    const cleanName = name.trim();

    if (!cleanName) {
      throw new Error('O nome não pode ficar vazio.');
    }

    let localPhotoPath = photoURL;

    if (photoUri) {
      const directory = FileSystem.documentDirectory;

      if (!directory) {
        throw new Error('Não foi possível acessar o armazenamento do aparelho.');
      }

      const destination = `${directory}profile-${currentUser.uid}.jpg`;
      const temporaryPath = `${directory}profile-${currentUser.uid}-temp.jpg`;

      await FileSystem.copyAsync({
        from: photoUri,
        to: temporaryPath,
      });

      const oldPhoto = await FileSystem.getInfoAsync(destination);

      if (oldPhoto.exists) {
        await FileSystem.deleteAsync(destination);
      }

      await FileSystem.moveAsync({
        from: temporaryPath,
        to: destination,
      });

      localPhotoPath = destination;
    }

    await updateProfile(currentUser, {
      displayName: cleanName,
    });

    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        name: cleanName,
        email: currentUser.email,
        photoURL: null,
      },
      { merge: true }
    );

    setUserName(cleanName);
    setPhotoURL(localPhotoPath);
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userName,
        photoURL,
        role,
        loading,
        login,
        register,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
