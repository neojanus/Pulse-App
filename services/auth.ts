import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, name: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  // Update display name
  await updateProfile(user, { displayName: name });

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email,
    displayName: name,
    createdAt: new Date(),
    isAdmin: false,
    settings: {
      theme: 'system',
      notificationsEnabled: true,
      notificationTimes: ['morning', 'afternoon', 'evening'],
    },
  });

  // Create empty preferences document
  await setDoc(doc(db, 'userPreferences', user.uid), {
    readItems: [],
    bookmarks: [],
    lastReadBriefing: null,
    updatedAt: new Date(),
  });

  return user;
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user
 */
export async function logOut() {
  return signOut(auth);
}
