<template>
  <div class="contact-list-container">
    <!-- Header Section -->
    <div class="header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="icon-contacts">👥</i>
          Contact Directory
        </h1>
        <p class="page-subtitle">Manage your business contacts efficiently</p>
      </div>
      <button class="btn-primary" @click="openAddModal">
        <i class="icon-plus">➕</i>
        Add New Contact
      </button>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-filter-section">
      <div class="search-box">
        <i class="search-icon">🔍</i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search contacts by name, email, phone, or company..."
          class="search-input"
        >
      </div>
      
      <div class="filter-controls">
        <select v-model="filterCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="employee">Employees</option>
          <option value="customer">Customers</option>
          <option value="supplier">Suppliers</option>
          <option value="partner">Partners</option>
        </select>
        
        <select v-model="sortBy" class="sort-select">
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="category">Sort by Category</option>
          <option value="created">Sort by Date Added</option>
        </select>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-number">{{ totalContacts }}</div>
        <div class="stat-label">Total Contacts</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ filteredContacts.length }}</div>
        <div class="stat-label">Filtered Results</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ selectedContacts.length }}</div>
        <div class="stat-label">Selected</div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="bulk-actions" v-if="selectedContacts.length > 0">
      <button class="btn-secondary" @click="exportSelected">
        <i class="icon-export">📤</i>
        Export ({{ selectedContacts.length }})
      </button>
      <button class="btn-danger" @click="bulkDelete">
        <i class="icon-delete">🗑️</i>
        Delete ({{ selectedContacts.length }})
      </button>
    </div>

    <!-- Contact Table -->
    <div class="table-container">
      <table class="contact-table">
        <thead>
          <tr>
            <th class="checkbox-column">
              <input 
                type="checkbox" 
                v-model="selectAll" 
                @change="toggleSelectAll"
                class="checkbox"
              >
            </th>
            <th class="avatar-column">Avatar</th>
            <th class="name-column">Name & Title</th>
            <th class="contact-column">Contact Info</th>
            <th class="category-column">Category</th>
            <th class="company-column">Company</th>
            <th class="date-column">Date Added</th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="contact in paginatedContacts" 
            :key="contact.id"
            class="contact-row"
            :class="{ 'selected': selectedContacts.includes(contact.id) }"
          >
            <td class="checkbox-column">
              <input 
                type="checkbox" 
                v-model="selectedContacts" 
                :value="contact.id"
                class="checkbox"
              >
            </td>
            
            <td class="avatar-column">
              <div class="avatar" :style="{ backgroundColor: getAvatarColor(contact.name) }">
                {{ contact.initials }}
              </div>
            </td>
            
            <td class="name-column">
              <div class="name-info">
                <div class="contact-name">{{ contact.name }}</div>
                <div class="contact-title">{{ contact.title }}</div>
              </div>
            </td>
            
            <td class="contact-column">
              <div class="contact-info">
                <div class="email">
                  <i class="icon-email">📧</i>
                  <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                </div>
                <div class="phone">
                  <i class="icon-phone">📞</i>
                  <a :href="`tel:${contact.phone}`">{{ contact.phone }}</a>
                </div>
              </div>
            </td>
            
            <td class="category-column">
              <span class="category-badge" :class="`category-${contact.category}`">
                {{ formatCategory(contact.category) }}
              </span>
            </td>
            
            <td class="company-column">
              <div class="company-info">
                <div class="company-name">{{ contact.company }}</div>
                <div class="company-address">{{ contact.address }}</div>
              </div>
            </td>
            
            <td class="date-column">
              {{ formatDate(contact.dateAdded) }}
            </td>
            
            <td class="actions-column">
              <div class="action-buttons">
                <button 
                  class="btn-icon btn-view" 
                  @click="viewContact(contact)"
                  title="View Details"
                >
                  👁️
                </button>
                <button 
                  class="btn-icon btn-edit" 
                  @click="editContact(contact)"
                  title="Edit Contact"
                >
                  ✏️
                </button>
                <button 
                  class="btn-icon btn-delete" 
                  @click="deleteContact(contact.id)"
                  title="Delete Contact"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-if="filteredContacts.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No contacts found</h3>
        <p>Try adjusting your search criteria or add a new contact.</p>
        <button class="btn-primary" @click="openAddModal">
          Add Your First Contact
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="btn-pagination" 
        @click="previousPage" 
        :disabled="currentPage === 1"
      >
        ← Previous
      </button>
      
      <div class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
        ({{ totalContacts }} total contacts)
      </div>
      
      <button 
        class="btn-pagination" 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
      >
        Next →
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Contact' : 'Add New Contact' }}</h2>
          <button class="btn-close" @click="closeModal">✕</button>
        </div>
        
        <form @submit.prevent="saveContact" class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input 
                type="text" 
                id="name"
                v-model="currentContact.name" 
                required
                class="form-input"
                placeholder="Enter full name"
              >
            </div>
            
            <div class="form-group">
              <label for="title">Job Title</label>
              <input 
                type="text" 
                id="title"
                v-model="currentContact.title" 
                class="form-input"
                placeholder="Enter job title"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input 
                type="email" 
                id="email"
                v-model="currentContact.email" 
                required
                class="form-input"
                placeholder="Enter email address"
              >
            </div>
            
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone"
                v-model="currentContact.phone" 
                class="form-input"
                placeholder="Enter phone number"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="category">Category *</label>
              <select 
                id="category"
                v-model="currentContact.category" 
                required
                class="form-select"
              >
                <option value="">Select category</option>
                <option value="employee">Employee</option>
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="partner">Partner</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="company">Company</label>
              <input 
                type="text" 
                id="company"
                v-model="currentContact.company" 
                class="form-input"
                placeholder="Enter company name"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="address">Address</label>
            <input 
              type="text" 
              id="address"
              v-model="currentContact.address" 
              class="form-input"
              placeholder="Enter address"
            >
          </div>
          
          <div class="form-group">
            <label for="notes">Notes</label>
            <textarea 
              id="notes"
              v-model="currentContact.notes" 
              class="form-textarea"
              placeholder="Additional notes about this contact"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditing ? 'Update Contact' : 'Add Contact' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'

export default {
  name: 'ContactListTemplate',
  setup() {
    // Sample data - replace with your actual data source
    const contacts = ref([
      {
        id: 1,
        name: 'Ahmad Rizki',
        title: 'Service Manager',
        email: 'ahmad.rizki@serviceac.com',
        phone: '+62 812 1111 2222',
        category: 'employee',
        company: 'AC Service Pro',
        address: 'Jl. Sudirman No. 123, Jakarta',
        notes: 'Experienced in AC maintenance and repair with 8+ years in the industry.',
        dateAdded: new Date('2024-01-15'),
        initials: 'AR'
      },
      {
        id: 2,
        name: 'Siti Nurhaliza',
        title: 'Customer Support Lead',
        email: 'siti.nurhaliza@serviceac.com',
        phone: '+62 812 3333 4444',
        category: 'employee',
        company: 'AC Service Pro',
        address: 'Jl. Thamrin No. 456, Jakarta',
        notes: 'Dedicated to providing excellent customer service and support.',
        dateAdded: new Date('2024-01-20'),
        initials: 'SN'
      },
      {
        id: 3,
        name: 'PT. Cool Air Solutions',
        title: 'Sales Director',
        email: 'sales@coolairsolutions.com',
        phone: '+62 21 5555 6666',
        category: 'supplier',
        company: 'Cool Air Solutions',
        address: 'Jl. Gatot Subroto No. 789, Jakarta',
        notes: 'Main supplier for AC units and spare parts.',
        dateAdded: new Date('2024-02-01'),
        initials: 'CA'
      },
      {
        id: 4,
        name: 'John Smith',
        title: 'Facility Manager',
        email: 'john.smith@techcorp.com',
        phone: '+62 812 9999 0000',
        category: 'customer',
        company: 'Tech Corp Indonesia',
        address: 'Jl. HR Rasuna Said No. 654, Jakarta',
        notes: 'Regular customer for office AC maintenance.',
        dateAdded: new Date('2024-02-15'),
        initials: 'JS'
      },
      {
        id: 5,
        name: 'Lisa Wong',
        title: 'Partnership Manager',
        email: 'lisa.wong@climatepartners.com',
        phone: '+62 812 1234 5678',
        category: 'partner',
        company: 'Climate Partners',
        address: 'Jl. Senayan No. 987, Jakarta',
        notes: 'Strategic partner for large commercial projects.',
        dateAdded: new Date('2024-02-20'),
        initials: 'LW'
      }
    ])

    // State management
    const searchQuery = ref('')
    const filterCategory = ref('')
    const sortBy = ref('name')
    const selectedContacts = ref([])
    const selectAll = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    
    // Modal state
    const showModal = ref(false)
    const isEditing = ref(false)
    const currentContact = reactive({
      id: null,
      name: '',
      title: '',
      email: '',
      phone: '',
      category: '',
      company: '',
      address: '',
      notes: ''
    })

    // Computed properties
    const filteredContacts = computed(() => {
      let filtered = contacts.value

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(contact => 
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.phone.includes(query) ||
          contact.company.toLowerCase().includes(query)
        )
      }

      // Apply category filter
      if (filterCategory.value) {
        filtered = filtered.filter(contact => contact.category === filterCategory.value)
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'email':
            return a.email.localeCompare(b.email)
          case 'category':
            return a.category.localeCompare(b.category)
          case 'created':
            return new Date(b.dateAdded) - new Date(a.dateAdded)
          default:
            return 0
        }
      })

      return filtered
    })

    const paginatedContacts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredContacts.value.slice(start, end)
    })

    const totalContacts = computed(() => contacts.value.length)
    const totalPages = computed(() => Math.ceil(filteredContacts.value.length / itemsPerPage.value))

    // Utility methods
    const generateInitials = (name) => {
      return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()
    }

    const getAvatarColor = (name) => {
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
      const index = name.charCodeAt(0) % colors.length
      return colors[index]
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatCategory = (category) => {
      return category.charAt(0).toUpperCase() + category.slice(1)
    }

    // Modal methods
    const openAddModal = () => {
      isEditing.value = false
      resetCurrentContact()
      showModal.value = true
    }

    const editContact = (contact) => {
      isEditing.value = true
      Object.assign(currentContact, contact)
      showModal.value = true
    }

    const viewContact = (contact) => {
      alert(`Contact Details:\n\nName: ${contact.name}\nTitle: ${contact.title}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nCategory: ${contact.category}\nCompany: ${contact.company}\nAddress: ${contact.address}\nNotes: ${contact.notes}`)
    }

    const closeModal = () => {
      showModal.value = false
      resetCurrentContact()
    }

    const resetCurrentContact = () => {
      Object.assign(currentContact, {
        id: null,
        name: '',
        title: '',
        email: '',
        phone: '',
        category: '',
        company: '',
        address: '',
        notes: ''
      })
    }

    const saveContact = () => {
      if (isEditing.value) {
        // Update existing contact
        const index = contacts.value.findIndex(c => c.id === currentContact.id)
        if (index !== -1) {
          contacts.value[index] = {
            ...currentContact,
            initials: generateInitials(currentContact.name)
          }
        }
      } else {
        // Add new contact
        const newContact = {
          ...currentContact,
          id: Date.now(),
          dateAdded: new Date(),
          initials: generateInitials(currentContact.name)
        }
        contacts.value.push(newContact)
      }
      closeModal()
    }

    const deleteContact = (id) => {
      if (confirm('Are you sure you want to delete this contact?')) {
        contacts.value = contacts.value.filter(c => c.id !== id)
        selectedContacts.value = selectedContacts.value.filter(cId => cId !== id)
      }
    }

    // Selection methods
    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedContacts.value = paginatedContacts.value.map(c => c.id)
      } else {
        selectedContacts.value = []
      }
    }

    const bulkDelete = () => {
      if (confirm(`Are you sure you want to delete ${selectedContacts.value.length} contact(s)?`)) {
        contacts.value = contacts.value.filter(c => !selectedContacts.value.includes(c.id))
        selectedContacts.value = []
        selectAll.value = false
      }
    }

    const exportSelected = () => {
      const selectedData = contacts.value.filter(c => selectedContacts.value.includes(c.id))
      const csvContent = [
        'Name,Title,Email,Phone,Category,Company,Address,Notes',
        ...selectedData.map(c => `"${c.name}","${c.title}","${c.email}","${c.phone}","${c.category}","${c.company}","${c.address}","${c.notes}"`)
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'contacts.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    }

    // Pagination methods
    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    // Watchers
    watch([searchQuery, filterCategory], () => {
      currentPage.value = 1
    })

    watch(selectedContacts, () => {
      selectAll.value = selectedContacts.value.length === paginatedContacts.value.length && paginatedContacts.value.length > 0
    }, { deep: true })

    return {
      contacts,
      searchQuery,
      filterCategory,
      sortBy,
      selectedContacts,
      selectAll,
      currentPage,
      showModal,
      isEditing,
      currentContact,
      filteredContacts,
      paginatedContacts,
      totalContacts,
      totalPages,
      getAvatarColor,
      formatDate,
      formatCategory,
      openAddModal,
      editContact,
      viewContact,
      closeModal,
      saveContact,
      deleteContact,
      toggleSelectAll,
      bulkDelete,
      exportSelected,
      previousPage,
      nextPage
    }
  }
}
</script>

<style scoped>
/* Container and Layout */
.contact-list-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-subtitle {
  color: #718096;
  margin: 0;
  font-size: 1.1rem;
}

/* Search and Filter */
.search-filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  position: relative;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4299e1;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select,
.sort-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
  min-width: 150px;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 8px;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Bulk Actions */
.bulk-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #fff3cd;
  border-radius: 8px;
  border: 1px solid #ffeaa7;
}

/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.contact-table {
  width: 100%;
  border-collapse: collapse;
}

.contact-table th {
  background: #f7fafc;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}

.contact-row {
  transition: background-color 0.2s;
}

.contact-row:hover {
  background: #f7fafc;
}

.contact-row.selected {
  background: #ebf8ff;
}

/* Table Columns */
.checkbox-column {
  width: 50px;
  text-align: center;
}

.avatar-column {
  width: 60px;
}

.name-column {
  width: 200px;
}

.contact-column {
  width: 250px;
}

.category-column {
  width: 120px;
}

.company-column {
  width: 200px;
}

.date-column {
  width: 120px;
}

.actions-column {
  width: 120px;
}

/* Avatar */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Contact Info */
.name-info {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.contact-title {
  color: #718096;
  font-size: 0.9rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.email,
.phone {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.email a,
.phone a {
  color: #4299e1;
  text-decoration: none;
}

.email a:hover,
.phone a:hover {
  text-decoration: underline;
}

/* Category Badge */
.category-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-employee {
  background: #c6f6d5;
  color: #22543d;
}

.category-customer {
  background: #bee3f8;
  color: #2a4365;
}

.category-supplier {
  background: #fbb6ce;
  color: #702459;
}

.category-partner {
  background: #faf089;
  color: #744210;
}

/* Company Info */
.company-info {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.company-address {
  color: #718096;
  font-size: 0.8rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-view {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-view:hover {
  background: #cbd5e0;
}

.btn-edit {
  background: #bee3f8;
  color: #2b6cb0;
}

.btn-edit:hover {
  background: #90cdf4;
}

.btn-delete {
  background: #fed7d7;
  color: #c53030;
}

.btn-delete:hover {
  background: #feb2b2;
}

/* Buttons */
.btn-primary {
  background: #4299e1;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background: #3182ce;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.btn-danger {
  background: #f56565;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-danger:hover {
  background: #e53e3e;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.btn-pagination {
  background: #4299e1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  background: #3182ce;
}

.btn-pagination:disabled {
  background: #a0aec0;
  cursor: not-allowed;
}

.page-info {
  color: #718096;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  color: #2d3748;
}

.empty-state p {
  margin: 0 0 24px 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  margin: 0;
  color: #2d3748;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #a0aec0;
  padding: 4px;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f7fafc;
  color: #4a5568;
}

/* Form */
.contact-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4299e1;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

/* Checkbox */
.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .search-filter-section {
    flex-direction: column;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .contact-table {
    font-size: 0.9rem;
  }
  
  .contact-table th,
  .contact-table td {
    padding: 12px 8px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .contact-list-container {
    padding: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .bulk-actions {
    flex-direction: column;
  }
}
</style>