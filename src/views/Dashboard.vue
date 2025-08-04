<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Your Notes</h1>
      <button @click="handleLogout" class="btn btn-secondary">
          <LogOut class="btn-icon" />
          Logout
        </button>
    </div>
    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-container">
        <Search class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search through your brilliant ideas..."
          class="search-input"
          @input="onSearchInput"
        />
        <button 
          v-if="searchQuery" 
          @click="clearSearch"
          class="clear-search-btn"
          title="Clear search"
        >
          <X />
        </button>
      </div>
      
      <!-- Search Results Count -->
      <div v-if="searchQuery" class="search-results">
        {{ filteredNotes.length }} result{{ filteredNotes.length !== 1 ? 's' : '' }} 
        for "{{ searchQuery }}"
      </div>
    </div>

    <div class="dashboard-header">
        <button @click="createNewNote" class="btn btn-primary">
          <Plus class="btn-icon" />
          New Note
        </button>        
        <div class="color-filter">
          <button 
            v-for="color in colorOptions" 
            :key="color.value"
            @click="filterByColor(color.value)"
            class="color-filter-btn"
            :class="{ active: selectedColor === color.value }"
            :style="{ backgroundColor: color.value }"
            :title="`Filter by ${color.name}`"
          >
          </button>
          <button 
            @click="clearColorFilter"
            class="color-filter-btn clear-filter"
            :class="{ active: !selectedColor }"
            title="Show all colors"
          >
            All
          </button>
        </div>
        <div class="view-toggle">
          <button 
            @click="viewMode = 'grid'" 
            class="toggle-btn"
            :class="{ active: viewMode === 'grid' }"
          >
            <Grid3x3 />
          </button>
          <button 
            @click="viewMode = 'list'" 
            class="toggle-btn"
            :class="{ active: viewMode === 'list' }"
          >
            <List />
          </button>
        </div>
        <!-- <button @click="handleLogout" class="btn btn-secondary">
          <LogOut class="btn-icon" />
          Logout
        </button> -->
    </div>

    <div v-if="filteredNotes.length === 0 && !loading" class="empty-state">
      <div class="empty-icon">
        <NotebookPen />
      </div>
      <h3>{{ getEmptyStateTitle() }}</h3>
      <p>{{ getEmptyStateMessage() }}</p>
      <div class="empty-state-actions">
        <button v-if="!hasActiveFilters" @click="createNewNote" class="btn btn-primary">
          <Plus class="btn-icon" />
          Create Your First Note
        </button>
        <button v-else @click="clearAllFilters" class="btn btn-secondary">
          Clear Filters
        </button>
      </div>
    </div>

    <div v-else-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your notes...</p>
    </div>

    <div 
      v-else 
      class="notes-container" 
      :class="{ 'grid-view': viewMode === 'grid', 'list-view': viewMode === 'list' }"
    >
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="note-card"
        :style="{ 
          backgroundColor: note.color || '#ffffff',
          '--note-color': note.color || '#e2e8f0'
        }"
        @click="openNote(note.id)"
      >
        <div class="note-header">
          <h3 class="note-title" v-html="getDisplayTitle(note)"></h3>
          <div class="note-actions">
            <div class="color-indicator" :style="{ backgroundColor: note.color || '#ffffff' }"></div>
            <button @click.stop="deleteNote(note.id)" class="action-btn delete-btn">
              <Trash2 />
            </button>
          </div>
        </div>
        
        <div class="note-content">
          <p v-html="getDisplayContent(note)"></p>
        </div>
        
        <div class="note-footer">
          <div class="note-tags" v-if="note.tags && note.tags.length > 0">
            <span 
              v-for="tag in note.tags.slice(0, 3)" 
              :key="tag" 
              class="tag"
            >
              #{{ tag }}
            </span>
            <span v-if="note.tags.length > 3" class="tag-more">
              +{{ note.tags.length - 3 }}
            </span>
          </div>
          <div class="note-date">
            <Clock />
            <span>{{ formatDate(note.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotes } from '../composables/useNotes.js'
import { useAuth } from '../composables/useAuth.js'
import { 
  Plus, 
  Grid3x3, 
  List, 
  NotebookPen, 
  Trash2, 
  Clock,
  Search,
  X,
  LogOut
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()
const { notes, loading, createNote, deleteNote: removeNote, searchNotes, notesByTag } = useNotes()

const viewMode = ref('grid')
const searchQuery = ref('')
const selectedTag = ref('')
const selectedColor = ref('')

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

// Debug tracking - remove in production
watch(notes, (newNotes) => {
  if (import.meta.env.DEV) {
    console.log('Dashboard: Notes updated', newNotes.length, 'notes')
  }
}, { immediate: true })

watch(user, (newUser) => {
  if (import.meta.env.DEV) {
    console.log('Dashboard: User changed', newUser?.uid)
  }
}, { immediate: true })

// Watch for route query parameters
watch(() => route.query, (query) => {
  searchQuery.value = query.search || ''
  selectedTag.value = query.tag || ''
}, { immediate: true })

const filteredNotes = computed(() => {
  let filtered = notes.value

  // Apply search filter first
  if (searchQuery.value) {
    const searchTerm = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(note => {
      const titleMatch = note.title?.toLowerCase().includes(searchTerm)
      const contentMatch = note.content?.toLowerCase().includes(searchTerm)
      const tagMatch = note.tags?.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      )
      return titleMatch || contentMatch || tagMatch
    })
  }

  // Apply tag filter
  if (selectedTag.value) {
    filtered = filtered.filter(note => 
      note.tags?.includes(selectedTag.value)
    )
  }

  // Apply color filter
  if (selectedColor.value) {
    filtered = filtered.filter(note => note.color === selectedColor.value)
  }

  return filtered
})

const filterByColor = (color) => {
  selectedColor.value = selectedColor.value === color ? '' : color
}

const clearColorFilter = () => {
  selectedColor.value = ''
}

const onSearchInput = () => {
  // Update URL query parameter for search
  router.push({ 
    name: 'Dashboard', 
    query: { 
      ...route.query, 
      search: searchQuery.value || undefined 
    } 
  })
}

const clearSearch = () => {
  searchQuery.value = ''
  router.push({ 
    name: 'Dashboard', 
    query: { 
      ...route.query, 
      search: undefined 
    } 
  })
}

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedTag.value || selectedColor.value)
})

const getEmptyStateTitle = () => {
  if (notes.value.length === 0) {
    return 'No notes yet'
  }
  return 'No notes found'
}

const getEmptyStateMessage = () => {
  if (notes.value.length === 0) {
    return 'Create your first note to get started'
  }
  
  const activeFilters = []
  if (searchQuery.value) activeFilters.push(`search "${searchQuery.value}"`)
  if (selectedTag.value) activeFilters.push(`tag "${selectedTag.value}"`)
  if (selectedColor.value) {
    const colorName = colorOptions.find(c => c.value === selectedColor.value)?.name || 'selected color'
    activeFilters.push(`${colorName.toLowerCase()} color`)
  }
  
  if (activeFilters.length > 0) {
    return `No notes match your ${activeFilters.join(', ')}. Try adjusting your filters.`
  }
  
  return 'Try adjusting your search terms'
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedTag.value = ''
  selectedColor.value = ''
  router.push({ name: 'Dashboard' })
}

const createNewNote = async () => {
  try {
    const noteId = await createNote()
    router.push(`/note/${noteId}`)
  } catch (error) {
    // TODO: Show user-friendly error message
    alert('Oops! Something went wrong creating your note. Please try again.')
  }
}

const openNote = (noteId) => {
  router.push(`/note/${noteId}`)
}

const deleteNote = async (noteId) => {
  if (confirm('Are you sure you want to delete this note?')) {
    try {
      await removeNote(noteId)
    } catch (error) {
      alert('Failed to delete note. Please check your connection and try again.')
    }
  }
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

const truncateContent = (content) => {
  if (!content) return 'No content yet...'
  const maxLength = viewMode.value === 'grid' ? 150 : 200
  return content.length > maxLength 
    ? content.substring(0, maxLength) + '...' 
    : content
}

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

const getDisplayContent = (note) => {
  const content = truncateContent(note.content)
  if (searchQuery.value) {
    return highlightSearchTerm(content, searchQuery.value)
  }
  return content
}

const getDisplayTitle = (note) => {
  const title = note.title || 'Untitled'
  if (searchQuery.value) {
    return highlightSearchTerm(title, searchQuery.value)
  }
  return title
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // I prefer more human-readable date formatting
  if (diffDays === 1) {
    return 'Today'
  } else if (diffDays === 2) {
    return 'Yesterday'
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/dashboard';
</style>
