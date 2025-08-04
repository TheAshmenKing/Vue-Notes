<template>
  <nav class="navbar">
    <div class="nav-header">
      <div class="nav-logo">
        <NotebookPen class="logo-icon" />
        <h2>Vue Notes</h2>
      </div>
    </div>

    <div class="nav-menu">
      <router-link to="/dashboard" class="nav-link" active-class="active">
        <Home class="nav-icon" />
        <span>Dashboard</span>
      </router-link>
      
      <button @click="createNewNote" class="nav-link nav-button">
        <Plus class="nav-icon" />
        <span>New Note</span>
      </button>

      <div class="nav-search">
        <Search class="search-icon" />
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Search notes..."
          class="search-input"
          @input="handleSearch"
        />
      </div>

      <div class="nav-tags" v-if="allTags.length > 0">
        <h4 class="nav-section-title">Tags</h4>
        <div class="tag-list">
          <button 
            v-for="tag in allTags" 
            :key="tag"
            @click="filterByTag(tag)"
            class="tag-button"
            :class="{ active: selectedTag === tag }"
          >
            #{{ tag }}
          </button>
        </div>
      </div>
    </div>

    <div class="nav-footer">
      <div class="user-info">
        <User class="user-icon" />
        <span class="user-email">{{ user?.email }}</span>
      </div>
      <button @click="handleLogout" class="logout-btn">
        <LogOut class="logout-icon" />
        <span>Logout</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { useNotes } from '../composables/useNotes.js'
import { 
  NotebookPen, 
  Home, 
  Plus, 
  Search, 
  User, 
  LogOut 
} from 'lucide-vue-next'

const router = useRouter()
const { user, logout } = useAuth()
const { createNote, getAllTags } = useNotes()

const searchTerm = ref('')
const selectedTag = ref(null)

const createNewNote = async () => {
  try {
    const noteId = await createNote()
    router.push(`/note/${noteId}`)
  } catch (error) {
    console.error('Error creating note:', error)
  }
}

const handleSearch = () => {
  // Emit search event or handle search logic
  // For now, we'll navigate to dashboard with search query
  router.push({ 
    name: 'Dashboard', 
    query: { search: searchTerm.value } 
  })
}

const filterByTag = (tag) => {
  selectedTag.value = selectedTag.value === tag ? null : tag
  router.push({ 
    name: 'Dashboard', 
    query: { tag: selectedTag.value } 
  })
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>

<style lang="scss" scoped>
@use '../assets/styles/navbar';
</style>


