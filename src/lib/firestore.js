// src/lib/firestore.js
import { db } from '../firebase'
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore'

// Create a new list with a random ID
export async function createNewList() {
  const ref = await addDoc(collection(db, 'shopping-lists'), {
    items: [],
    createdAt: new Date(),
  })
  return ref.id
}

// Load list by ID
export async function getList(id) {
  const ref = doc(db, 'shopping-lists', id)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data()
  } else {
    throw new Error('List not found')
  }
}

// Subscribe to real-time changes
export function subscribeToList(id, callback) {
  const ref = doc(db, 'shopping-lists', id)
  return onSnapshot(ref, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data())
    }
  })
}

// Update list items
export async function updateList(id, items) {
  const ref = doc(db, 'shopping-lists', id)
  await updateDoc(ref, { items })
}
