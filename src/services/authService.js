import { auth } from '@/lib/firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'

export async function signUp({ email, password }) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  return user
}

export async function signIn({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export function getCurrentUser() {
  return auth.currentUser
}
