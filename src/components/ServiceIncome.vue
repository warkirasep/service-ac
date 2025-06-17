<template>
  <div class="service-income">
    <!-- Header Section -->
    <div class="header-section">
      <h2>Pendapatan Service AC</h2>
      <div class="date-filter">
        <label>Periode:</label>
        <input type="date" v-model="filters.startDate" class="date-input">
        <span>sampai</span>
        <input type="date" v-model="filters.endDate" class="date-input">
        <button @click="applyFilter" class="filter-btn">Terapkan Filter</button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card income">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>Total Pendapatan</h3>
          <p>Rp {{ formatNumber(totalIncome) }}</p>
        </div>
      </div>
      <div class="card services">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 16V8C21 7.46957 20.7893 6.96086 20.4142 6.58579C20.0391 6.21071 19.5304 6 19 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18H19C19.5304 18 20.0391 17.7893 20.4142 17.4142C20.7893 17.0391 21 16.5304 21 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>Total Service</h3>
          <p>{{ totalServices }}</p>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="action-buttons">
      <button @click="showAddModal = true" class="add-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Tambah Transaksi
      </button>
    </div>

    <!-- Transaction Table -->
    <div class="transaction-table">
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>No. Order</th>
            <th>Pelanggan</th>
            <th>Jenis Service</th>
            <th>Biaya</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in transactions" :key="transaction.id">
            <td>{{ index + 1 }}</td>
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ transaction.orderNo }}</td>
            <td>{{ transaction.customer }}</td>
            <td>{{ transaction.serviceType }}</td>
            <td>Rp {{ formatNumber(transaction.amount) }}</td>
            <td>
              <span :class="['status-badge', transaction.status.toLowerCase()]">{{ transaction.status }}</span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="editTransaction(transaction)" class="edit-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button @click="deleteTransaction(transaction)" class="delete-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal">
      <div class="modal-content">
        <h3>{{ showEditModal ? 'Edit Transaksi' : 'Tambah Transaksi' }}</h3>
        <form @submit.prevent="submitTransaction">
          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="currentTransaction.date" required>
          </div>
          <div class="form-group">
            <label>No. Order</label>
            <input type="text" v-model="currentTransaction.orderNo" required>
          </div>
          <div class="form-group">
            <label>Pelanggan</label>
            <input type="text" v-model="currentTransaction.customer" required>
          </div>
          <div class="form-group">
            <label>Jenis Service</label>
            <select v-model="currentTransaction.serviceType" required>
              <option value="Cuci AC">Cuci AC</option>
              <option value="Service AC">Service AC</option>
              <option value="Perbaikan AC">Perbaikan AC</option>
            </select>
          </div>
          <div class="form-group">
            <label>Biaya</label>
            <input type="number" v-model="currentTransaction.amount" required>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="currentTransaction.status" required>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="closeModal" class="cancel-btn">Batal</button>
            <button type="submit" class="submit-btn">{{ showEditModal ? 'Update' : 'Simpan' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Konfirmasi Hapus</h3>
        <p>Apakah Anda yakin ingin menghapus transaksi ini?</p>
        <div class="modal-buttons">
          <button @click="showDeleteModal = false" class="cancel-btn">Batal</button>
          <button @click="confirmDelete" class="delete-btn">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceIncome',
  data() {
    return {
      filters: {
        startDate: '',
        endDate: ''
      },
      transactions: [
        {
          id: 1,
          date: '2024-01-15',
          orderNo: 'ORD001',
          customer: 'John Doe',
          serviceType: 'Cuci AC',
          amount: 150000,
          status: 'Completed'
        },
        {
          id: 2,
          date: '2024-01-16',
          orderNo: 'ORD002',
          customer: 'Jane Smith',
          serviceType: 'Service AC',
          amount: 250000,
          status: 'Pending'
        }
      ],
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      currentTransaction: {
        id: null,
        date: '',
        orderNo: '',
        customer: '',
        serviceType: '',
        amount: 0,
        status: ''
      },
      transactionToDelete: null
    }
  },
  computed: {
    totalIncome() {
      return this.transactions.reduce((sum, transaction) => {
        return transaction.status === 'Completed' ? sum + transaction.amount : sum
      }, 0)
    },
    totalServices() {
      return this.transactions.length
    }
  },
  methods: {
    formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID')
    },
    applyFilter() {
      // Implement date filtering logic here
      console.log('Filtering data between', this.filters.startDate, 'and', this.filters.endDate)
    },
    editTransaction(transaction) {
      this.currentTransaction = { ...transaction }
      this.showEditModal = true
    },
    deleteTransaction(transaction) {
      this.transactionToDelete = transaction
      this.showDeleteModal = true
    },
    confirmDelete() {
      if (this.transactionToDelete) {
        this.transactions = this.transactions.filter(t => t.id !== this.transactionToDelete.id)
        this.showDeleteModal = false
        this.transactionToDelete = null
      }
    },
    submitTransaction() {
      if (this.showEditModal) {
        const index = this.transactions.findIndex(t => t.id === this.currentTransaction.id)
        if (index !== -1) {
          this.transactions.splice(index, 1, { ...this.currentTransaction })
        }
      } else {
        const newTransaction = {
          ...this.currentTransaction,
          id: this.transactions.length + 1
        }
        this.transactions.push(newTransaction)
      }
      this.closeModal()
    },
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.currentTransaction = {
        id: null,
        date: '',
        orderNo: '',
        customer: '',
        serviceType: '',
        amount: 0,
        status: ''
      }
    }
  }
}
</script>

<style scoped>
.service-income {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.date-filter {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.date-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  padding: 1rem;
  border-radius: 50%;
  background: #f0f0f0;
}

.card-content h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.card-content p {
  margin: 0.5rem 0 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.action-buttons {
  margin-bottom: 1.5rem;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.transaction-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.status-badge.completed {
  background-color: #e8f5e9;
  color: #4CAF50;
}

.status-badge.pending {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-badge.cancelled {
  background-color: #ffebee;
  color: #f44336;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.edit-btn:hover {
  background-color: #e3f2fd;
}

.delete-btn:hover {
  background-color: #ffebee;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>