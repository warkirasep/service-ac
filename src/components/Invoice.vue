<template>
  <div class="invoice-page">
    <!-- Header Section -->
    <header class="page-header">
      <div class="header-content">
        <h1>Faktur Service AC</h1>
        <button @click="openCreateModal" class="create-btn">
          <i class="fas fa-plus"></i> Buat Faktur Baru
        </button>
      </div>
    </header>

    <!-- Filters Section -->
    <section class="filters-section">
      <div class="filter-group">
        <input type="text" v-model="filters.search" placeholder="Cari faktur..." class="search-input">
        <select v-model="filters.status" class="status-filter">
          <option value="">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Lunas</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
        <div class="date-range">
          <input type="date" v-model="filters.startDate" class="date-input">
          <span>sampai</span>
          <input type="date" v-model="filters.endDate" class="date-input">
        </div>
      </div>
    </section>

    <!-- Invoices Table -->
    <section class="table-section">
      <table class="invoices-table">
        <thead>
          <tr>
            <th>No. Faktur</th>
            <th>Tanggal</th>
            <th>Pelanggan</th>
            <th>Layanan</th>
            <th>Total</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in filteredInvoices" :key="invoice.id">
            <td>{{ invoice.number }}</td>
            <td>{{ formatDate(invoice.date) }}</td>
            <td>{{ invoice.customer }}</td>
            <td>{{ invoice.service }}</td>
            <td>{{ formatCurrency(invoice.total) }}</td>
            <td>
              <span :class="['status-badge', invoice.status]">{{ invoice.status }}</span>
            </td>
            <td class="actions">
              <button @click="viewInvoice(invoice)" class="action-btn view" title="Lihat PDF">
                <i class="fas fa-file-pdf"></i>
              </button>
              <button @click="editInvoice(invoice)" class="action-btn edit">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="deleteInvoice(invoice)" class="action-btn delete">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Create/Edit Invoice Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Edit Faktur' : 'Buat Faktur Baru' }}</h2>
        <form @submit.prevent="saveInvoice">
          <div class="form-group">
            <label>Nomor Faktur</label>
            <input type="text" v-model="currentInvoice.number" required>
          </div>
          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="currentInvoice.date" required>
          </div>
          <div class="form-group">
            <label>Pelanggan</label>
            <input type="text" v-model="currentInvoice.customer" required>
          </div>
          <div class="form-group">
            <label>Layanan</label>
            <select v-model="currentInvoice.service" required>
              <option value="Cuci AC">Cuci AC</option>
              <option value="Service AC">Service AC</option>
              <option value="Instalasi AC">Instalasi AC</option>
            </select>
          </div>
          <div class="form-group">
            <label>Total</label>
            <input type="number" v-model="currentInvoice.total" required>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="currentInvoice.status" required>
              <option value="pending">Pending</option>
              <option value="paid">Lunas</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Batal</button>
            <button type="submit" class="save-btn">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Invoice',
  data() {
    return {
      filters: {
        search: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      invoices: [
        {
          id: 1,
          number: 'INV-001',
          date: '2024-01-15',
          customer: 'John Doe',
          service: 'Cuci AC',
          total: 250000,
          status: 'paid'
        },
        {
          id: 2,
          number: 'INV-002',
          date: '2024-01-16',
          customer: 'Jane Smith',
          service: 'Service AC',
          total: 500000,
          status: 'pending'
        }
      ],
      showModal: false,
      isEditing: false,
      currentInvoice: {}
    }
  },
  computed: {
    filteredInvoices() {
      return this.invoices.filter(invoice => {
        const matchesSearch = invoice.number.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                            invoice.customer.toLowerCase().includes(this.filters.search.toLowerCase())
        const matchesStatus = !this.filters.status || invoice.status === this.filters.status
        const matchesDateRange = (!this.filters.startDate || invoice.date >= this.filters.startDate) &&
                                (!this.filters.endDate || invoice.date <= this.filters.endDate)
        return matchesSearch && matchesStatus && matchesDateRange
      })
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID')
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(amount)
    },
    openCreateModal() {
      this.isEditing = false
      this.currentInvoice = {
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
      this.showModal = true
    },
    editInvoice(invoice) {
      this.isEditing = true
      this.currentInvoice = { ...invoice }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.currentInvoice = {}
    },
    saveInvoice() {
      if (this.isEditing) {
        const index = this.invoices.findIndex(inv => inv.id === this.currentInvoice.id)
        this.invoices[index] = { ...this.currentInvoice }
      } else {
        this.currentInvoice.id = this.invoices.length + 1
        this.invoices.push({ ...this.currentInvoice })
      }
      this.closeModal()
    },
    viewInvoice(invoice) {
      const invoiceData = {
        ...invoice,
        address: 'Jl. Contoh No. 456, Jakarta',
        phone: '0812-3456-7890',
        items: [
          {
            description: invoice.service,
            quantity: 1,
            price: invoice.total
          }
        ]
      }
      this.$router.push({
        name: 'InvoicePDF',
        query: { data: JSON.stringify(invoiceData) }
      })
    },
    deleteInvoice(invoice) {
      if (confirm('Apakah Anda yakin ingin menghapus faktur ini?')) {
        this.invoices = this.invoices.filter(inv => inv.id !== invoice.id)
      }
    }
  }
}
</script>

<style scoped>
.invoice-page {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filters-section {
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input,
.status-filter,
.date-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.invoices-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.status-badge.paid {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.action-btn.view {
  background-color: #17a2b8;
  color: white;
}

.action-btn.edit {
  background-color: #ffc107;
  color: #000;
}

.action-btn.delete {
  background-color: #dc3545;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
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
  border-radius: 0.25rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 0.25rem;
  cursor: pointer;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}
</style>