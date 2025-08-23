// src/lib/firestore.js
import { db } from "../firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

// Create a new list with a random ID
export async function createNewList(
  userId = null,
  userName = null,
  listName = null
) {
  const listData = {
    items: [],
    createdAt: new Date(),
  };

  // Add user information if user is logged in
  if (userId) {
    listData.userId = userId;
    listData.userName = userName;
  }

  // Add list name if provided
  if (listName) {
    listData.name = listName;
  }

  const ref = await addDoc(collection(db, "shopping-lists"), listData);
  return ref.id;
}

// Load list by ID
export async function getList(id) {
  const ref = doc(db, "shopping-lists", id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  } else {
    throw new Error("List not found");
  }
}

// Subscribe to real-time changes
export function subscribeToList(id, callback) {
  if (!id) {
    return () => {};
  }

  try {
    const ref = doc(db, "shopping-lists", id);
    return onSnapshot(
      ref,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() });
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Error in list subscription:", error);
        callback(null);
      }
    );
  } catch (error) {
    console.error("Error setting up list subscription:", error);
    return () => {};
  }
}

// Update list items
export async function updateList(id, items) {
  const ref = doc(db, "shopping-lists", id);
  await updateDoc(ref, {
    items,
    updatedAt: new Date(),
  });
}

// Update existing list with user information
export async function updateListWithUser(listId, userId, userName) {
  try {
    const ref = doc(db, "shopping-lists", listId);
    await updateDoc(ref, {
      userId: userId,
      userName: userName,
      updatedAt: new Date(),
    });
    console.log("Updated list", listId, "with user info");
  } catch (error) {
    console.error("Error updating list with user info:", error);
  }
}

// Get user's list history
export async function getUserLists(userId) {
  if (!userId) {
    return [];
  }

  try {
    const q = query(
      collection(db, "shopping-lists"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const lists = [];

    querySnapshot.forEach((doc) => {
      lists.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort manually to avoid orderBy issues
    lists.sort((a, b) => {
      const dateA = a.createdAt?.toDate
        ? a.createdAt.toDate()
        : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate
        ? b.createdAt.toDate()
        : new Date(b.createdAt);
      return dateB - dateA;
    });

    console.log("getUserLists found", lists.length, "lists for user", userId);
    return lists;
  } catch (error) {
    console.error("Error getting user lists:", error);
    return [];
  }
}

// Get all lists (for debugging and migration)
export async function getAllLists() {
  try {
    const q = query(
      collection(db, "shopping-lists"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const lists = [];

    querySnapshot.forEach((doc) => {
      lists.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("getAllLists found", lists.length, "total lists");
    return lists;
  } catch (error) {
    console.error("Error getting all lists:", error);
    return [];
  }
}

// Subscribe to user's list history in real-time (simpler version without orderBy)
export function subscribeToUserListsSimple(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(
      collection(db, "shopping-lists"),
      where("userId", "==", userId)
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const lists = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          lists.push({
            id: doc.id,
            ...data,
          });
        });

        // Sort manually to avoid orderBy issues
        lists.sort((a, b) => {
          const dateA = a.createdAt?.toDate
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
          return dateB - dateA;
        });

        callback(lists);
      },
      (error) => {
        console.error("Error in user lists subscription:", error);
        callback([]);
      }
    );
  } catch (error) {
    console.error("Error setting up user lists subscription:", error);
    callback([]);
    return () => {};
  }
}

// Subscribe to user's list history in real-time
export function subscribeToUserLists(userId, callback) {
  if (!userId) {
    console.log("No userId provided, returning empty array");
    callback([]);
    return () => {};
  }

  try {
    console.log("Creating query for userId:", userId);
    const q = query(
      collection(db, "shopping-lists"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const lists = [];
        querySnapshot.forEach((doc) => {
          lists.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        console.log(
          "Query result - found",
          lists.length,
          "lists for user",
          userId
        );
        callback(lists);
      },
      (error) => {
        console.error("Error in user lists subscription:", error);
        callback([]);
      }
    );
  } catch (error) {
    console.error("Error setting up user lists subscription:", error);
    callback([]);
    return () => {};
  }
}
