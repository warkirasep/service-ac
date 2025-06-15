<template>
  <div class="contact-management">
    <!-- Header Section -->
    <div class="header">
      <div class="header-left">
        <h1>Contact Management</h1>
        <p>Manage your contact database</p>
      </div>
      <div class="header-right">
        <button @click="openAddModal" class="add-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Add Contact
        </button>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="controls-section">
      <div class="search-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search contacts..."
          class="search-input"
        >
      </div>
      <div class="filter-controls">
        <select v-model="filterCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="customer">Customer</option>
          <option value="supplier">Supplier</option>
          <option value="partner">Partner</option>
          <option value="employee">Employee</option>
        </select>
        <select v-model="sortBy" class="sort-select">
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="category">Sort by Category</option>
          <option value="created">Sort by Date Added</option>
        </select>
      </div>
    </div>

    <!-- Contact Table -->
    <div class="table-container">
      <table class="contact-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Category</th>
            <th>Company</th>
            <th>Date Added</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contact in filteredContacts" :key="contact.id" class="table-row">
            <td>
              <input type="checkbox" v-model="selectedContacts" :value="contact.id">
            </td>
            <td>
              <div class="contact-info">
                <div class="avatar">{{ contact.initials }}</div>
                <div class="name-info">
                  <span class="name">{{ contact.name }}</span>
                  <span class="title">{{ contact.title }}</span>
                </div>
              </div>
            </td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.phone }}</td>
            <td>
              <span class="category-badge" :class="contact.category">
                {{ contact.category }}
              </span>
            </td>
            <td>{{ contact.company }}</td>
            <td>{{ formatDate(contact.dateAdded) }}</td>
            <td>
              <div class="action-buttons">
                <button @click="viewContact(contact)" class="action-btn view-btn" title="View">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
                <button @click="editContact(contact)" class="action-btn edit-btn" title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
                <button @click="deleteContact(contact.id)" class="action-btn delete-btn" title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bulk Actions -->
    <div class="bulk-actions" v-if="selectedContacts.length > 0">
      <span class="selected-count">{{ selectedContacts.length }} contact(s) selected</span>
      <button @click="bulkDelete" class="bulk-btn delete">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
        </svg>
        Delete Selected
      </button>
      <button @click="exportSelected" class="bulk-btn export">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
          <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
        </svg>
        Export Selected
      </button>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1" class="page-btn">
        Previous
      </button>
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }} ({{ totalContacts }} total)
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
        Next
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Contact' : 'Add New Contact' }}</h3>
          <button @click="closeModal" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveContact" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" v-model="currentContact.name" required>
            </div>
            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="currentContact.title">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" v-model="currentContact.email" required>
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" v-model="currentContact.phone">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category *</label>
              <select v-model="currentContact.category" required>
                <option value="">Select Category</option>
                <option value="customer">Customer</option>
                <option value="supplier">Supplier</option>
                <option value="partner">Partner</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div class="form-group">
              <label>Company</label>
              <input type="text" v-model="currentContact.company">
            </div>
          </div>
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="currentContact.address" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label>Notes</label>
            <textarea v-model="currentContact.notes" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">{{ isEditing ? 'Update' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'

export default {
  name: 'ContactManagement',
  setup() {
    // State management
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
        name: 'Maya Indira',
        title: 'Operations Coordinator',
        email: 'maya.indira@serviceac.com',
        phone: '+62 812 7777 8888',
        category: 'employee',
        company: 'AC Service Pro',
        address: 'Jl. Kuningan No. 321, Jakarta',
        notes: 'Ensures smooth operations and timely service delivery.',
        dateAdded: new Date('2024-02-10'),
        initials: 'MI'
      },
      {
        id: 5,
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
        id: 6,
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

      // Apply pagination
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filtered.slice(start, end)
    })

    const totalContacts = computed(() => {
      let filtered = contacts.value
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(contact => 
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.phone.includes(query) ||
          contact.company.toLowerCase().includes(query)
        )
      }
      if (filterCategory.value) {
        filtered = filtered.filter(contact => contact.category === filterCategory.value)
      }
      return filtered.length
    })

    const totalPages = computed(() => Math.ceil(totalContacts.value / itemsPerPage.value))

    // Methods
    const generateInitials = (name) => {
      return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

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

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedContacts.value = filteredContacts.value.map(c => c.id)
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

    // Watch for changes in filters to reset pagination
    watch([searchQuery, filterCategory], () => {
      currentPage.value = 1
    })

    // Watch selectAll changes
    watch(selectedContacts, () => {
      selectAll.value = selectedContacts.value.length === filteredContacts.value.length && filteredContacts.value.length > 0
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
      totalContacts,
      totalPages,
      formatDate,
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
.contact-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.header p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

.info-card .icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.info-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.info-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

.contact-form-section {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 4rem;
}

.contact-form-section h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.contact-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.team-section {
  margin-bottom: 4rem;
}

.team-section h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.team-member {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.member-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.team-member h4 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.position {
  color: #3498db;
  font-weight: 600;
  margin-bottom: 1rem;
}

.description {
  color: #7f8c8d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-links span {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.faq-section h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.faq-question {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
}

.faq-question:hover {
  background-color: #f8f9fa;
}

.faq-question h4 {
  color: #2c3e50;
  margin: 0;
}

.toggle-icon {
  font-size: 1.5rem;
  color: #3498db;
  font-weight: bold;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #7f8c8d;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .contact-page {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .contact-form-section {
    padding: 2rem 1rem;
  }
}
</style>