import { ref, computed, watch } from 'vue'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { useAuth } from './useAuth.js'

const notes = ref([])
const loading = ref(false)
const error = ref(null)

export function useNotes() {
  const { user } = useAuth()

  // Real-time listener for notes
  let unsubscribe = null

  const startNotesListener = () => {
    if (!user.value) {
      return // Silently fail if no user
    }

    loading.value = true

    const notesQuery = query(
      collection(db, 'notes'),
      where('userId', '==', user.value.uid),
      orderBy('updatedAt', 'desc')
    )

    unsubscribe = onSnapshot(notesQuery, (snapshot) => {
      notes.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, (err) => {
      error.value = err.message
      loading.value = false
    })
  }

  const stopNotesListener = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    notes.value = []
  }

  // Auto-start listener when user becomes available
  watch(user, (newUser, oldUser) => {
    if (newUser && !oldUser) {
      // User just logged in
      startNotesListener()
    } else if (!newUser && oldUser) {
      // User just logged out
      stopNotesListener()
    }
  }, { immediate: true })

  const createNote = async (title = 'Untitled Note', content = '') => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      loading.value = true
      error.value = null

      const noteData = {
        title,
        content,
        userId: user.value.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        tags: [],
        color: '#ffffff'
      }

      const docRef = await addDoc(collection(db, 'notes'), noteData)
      return docRef.id
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getNote = async (noteId) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      loading.value = true
      error.value = null

      const noteRef = doc(db, 'notes', noteId)
      const noteSnap = await getDoc(noteRef)

      if (!noteSnap.exists()) {
        throw new Error('Note not found')
      }

      const noteData = noteSnap.data()
      
      // Verify the note belongs to the current user
      if (noteData.userId !== user.value.uid) {
        throw new Error('Access denied')
      }

      return {
        id: noteSnap.id,
        ...noteData
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateNote = async (noteId, updates) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      loading.value = true
      error.value = null

      const noteRef = doc(db, 'notes', noteId)
      await updateDoc(noteRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteNote = async (noteId) => {
    if (!user.value) throw new Error('User not authenticated')

    try {
      loading.value = true
      error.value = null

      const noteRef = doc(db, 'notes', noteId)
      await deleteDoc(noteRef)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchNotes = computed(() => {
    return (searchTerm) => {
      if (!searchTerm) return notes.value
      
      return notes.value.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
  })

  const notesByTag = computed(() => {
    return (tag) => {
      return notes.value.filter(note => note.tags.includes(tag))
    }
  })

  const getAllTags = computed(() => {
    const allTags = notes.value.flatMap(note => note.tags)
    return [...new Set(allTags)]
  })

  return {
    notes: computed(() => notes.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    createNote,
    getNote,
    updateNote,
    deleteNote,
    searchNotes,
    notesByTag,
    getAllTags,
    startNotesListener,
    stopNotesListener
  }
}
