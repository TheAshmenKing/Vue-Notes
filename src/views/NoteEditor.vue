<template>
  <div class="note-editor">
    <div class="editor-header">
      <div class="nav-actions">
        <button @click="goBack" class="btn btn-secondary">
          <ArrowLeft class="btn-icon" />
          Back
        </button>
        
        <div class="auto-save-status" v-if="note">
          <div v-if="saving" class="saving">
            <div class="spinner-sm"></div>
            Saving...
          </div>
          <div v-else-if="lastSaved" class="saved">
            <Check class="check-icon" />
            Saved {{ formatLastSaved(lastSaved) }}
          </div>
        </div>
      </div>

      <div class="editor-tools">
        <div class="color-picker">
          <label>Color:</label>
          <div class="color-options">
            <button
              v-for="color in colorOptions"
              :key="color.value"
              @click="updateColor(color.value)"
              class="color-option"
              :class="{ active: note?.color === color.value }"
              :style="{ backgroundColor: color.value }"
              :title="color.name"
            ></button>
          </div>
        </div>

        <button @click="deleteCurrentNote" class="btn btn-danger" v-if="note">
          <Trash2 class="btn-icon" />
          Delete
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading note...</p>
    </div>

    <div v-else-if="!note" class="error-state">
      <div class="error-icon">
        <AlertCircle />
      </div>
      <h3>Note not found</h3>
      <p>The note you're looking for doesn't exist or you don't have permission to view it.</p>
      <button @click="goBack" class="btn btn-primary">
        <ArrowLeft class="btn-icon" />
        Go Back
      </button>
    </div>

    <div v-else class="editor-content" :style="{ backgroundColor: note.color || '#ffffff' }">
      <input
        v-model="note.title"
        type="text"
        placeholder="What's on your mind today?"
        class="title-input"
        @input="debouncedSave"
      />
      
      <textarea
        v-model="note.content"
        placeholder="Pour your thoughts here... every great idea starts with a single word."
        class="content-textarea"
        @input="debouncedSave"
        ref="contentTextarea"
      ></textarea>

      <div class="editor-footer">
        <div class="tags-section">
          <label>Tags:</label>
          <div class="tags-input-container">
            <div class="tags-display">
              <span
                v-for="tag in note.tags || []"
                :key="tag"
                class="tag"
              >
                #{{ tag }}
                <button @click="removeTag(tag)" class="remove-tag">
                  <X />
                </button>
              </span>
            </div>
            <input
              v-model="newTag"
              type="text"
              placeholder="Add a tag (press Enter)"
              class="tag-input"
              @keydown.enter.prevent="addTag"
              @keydown.space.prevent="addTag"
            />
          </div>
        </div>

        <div class="note-meta">
          <div class="note-dates">
            <div v-if="note.createdAt">
              <Calendar class="meta-icon" />
              Created: {{ formatDate(note.createdAt) }}
            </div>
            <div v-if="note.updatedAt">
              <Clock class="meta-icon" />
              Updated: {{ formatDate(note.updatedAt) }}
            </div>
          </div>
          
          <div class="word-count">
            {{ getWordCount() }} words, {{ getCharCount() }} characters
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotes } from '../composables/useNotes.js'
import { 
  ArrowLeft, 
  Trash2, 
  Check, 
  AlertCircle, 
  X, 
  Calendar, 
  Clock 
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { getNote, updateNote, deleteNote: removeNote } = useNotes()

const note = ref(null)
const loading = ref(true)
const saving = ref(false)
const lastSaved = ref(null)
const newTag = ref('')
const contentTextarea = ref(null)

let saveTimeout = null

const colorOptions = [
  { name: 'White', value: '#ffffff' },
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Green', value: '#d1fae5' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Purple', value: '#e9d5ff' },
  { name: 'Pink', value: '#fce7f3' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Red', value: '#fee2e2' }
]

onMounted(async () => {
  await loadNote()
  
  // Focus on content area after load
  await nextTick()
  if (contentTextarea.value) {
    contentTextarea.value.focus()
  }
})

onUnmounted(() => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
    // Force save on unmount
    saveNote()
  }
})

const loadNote = async () => {
  try {
    loading.value = true
    const noteId = route.params.id
    const loadedNote = await getNote(noteId)
    
    if (loadedNote) {
      note.value = { ...loadedNote }
    } else {
      // Note not found - could be deleted or access denied
      await router.push('/dashboard')
    }
  } catch (error) {
    // Handle note loading error gracefully
    await router.push('/dashboard')
  } finally {
    loading.value = false
  }
}

const debouncedSave = () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }
  
  // Wait a bit before saving to avoid hammering the server
  saveTimeout = setTimeout(() => {
    saveNote()
  }, 1000)
}

const saveNote = async () => {
  if (!note.value || saving.value) return
  
  try {
    saving.value = true
    await updateNote(note.value.id, {
      title: note.value.title || 'Untitled',
      content: note.value.content || '',
      color: note.value.color,
      tags: note.value.tags || []
    })
    lastSaved.value = new Date()
  } catch (error) {
    // Auto-save failed - could retry or show user feedback
    saving.value = false
  } finally {
    saving.value = false
  }
}

const updateColor = (color) => {
  if (note.value) {
    note.value.color = color
    debouncedSave()
  }
}

const addTag = () => {
  const tag = newTag.value.trim().toLowerCase()
  if (tag && note.value) {
    if (!note.value.tags) {
      note.value.tags = []
    }
    if (!note.value.tags.includes(tag)) {
      note.value.tags.push(tag)
      debouncedSave()
    }
    newTag.value = ''
  }
}

const removeTag = (tagToRemove) => {
  if (note.value && note.value.tags) {
    note.value.tags = note.value.tags.filter(tag => tag !== tagToRemove)
    debouncedSave()
  }
}

const deleteCurrentNote = async () => {
  if (!note.value) return
  
  if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
    try {
      await removeNote(note.value.id)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }
}

const goBack = () => {
  router.push('/dashboard')
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString()
}

const formatLastSaved = (date) => {
  const now = new Date()
  const diffSeconds = Math.floor((now - date) / 1000)
  
  if (diffSeconds < 60) {
    return 'just now'
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60)
    return `${minutes}m ago`  // Shorter format
  } else {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

const getWordCount = () => {
  if (!note.value?.content) return 0
  return note.value.content.trim().split(/\s+/).filter(word => word.length > 0).length
}

const getCharCount = () => {
  if (!note.value?.content) return 0
  return note.value.content.length
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/note-editor';
</style>

