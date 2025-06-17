<template>
  <div class="monthly-report">
    <!-- Header Section -->
    <div class="header-section">
      <h2>Laporan Bulanan</h2>
      <div class="month-filter">
        <label>Periode:</label>
        <input type="month" v-model="selectedMonth" class="month-input" @change="generateReport">
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card income">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>Total Pendapatan</h3>
          <p>Rp {{ formatNumber(totalIncome) }}</p>
        </div>
      </div>
      <div class="card expense">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 12L3 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 18L3 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>Total Pengeluaran</h3>
          <p>Rp {{ formatNumber(totalExpense) }}</p>
        </div>
      </div>
      <div class="card profit">
        <div class="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="card-content">
          <h3>Keuntungan</h3>
          <p>Rp {{ formatNumber(totalProfit) }}</p>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-container">
        <h3>Grafik Pendapatan & Pengeluaran</h3>
        <div class="chart-placeholder">
          <!-- Chart will be implemented here -->
          <p>Grafik akan ditampilkan di sini</p>
        </div>
      </div>
    </div>

    <!-- Detailed Reports Section -->
    <div class="detailed-reports">
      <!-- Income Details -->
      <div class="report-section">
        <h3>Detail Pendapatan</h3>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="income in incomeDetails" :key="income.id">
              <td>{{ formatDate(income.date) }}</td>
              <td>{{ income.description }}</td>
              <td>Rp {{ formatNumber(income.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Expense Details -->
      <div class="report-section">
        <h3>Detail Pengeluaran</h3>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Keterangan</th>
              <th>Kategori</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in expenseDetails" :key="expense.id">
              <td>{{ formatDate(expense.date) }}</td>
              <td>{{ expense.description }}</td>
              <td>{{ expense.category }}</td>
              <td>Rp {{ formatNumber(expense.amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Export Button -->
    <div class="export-section">
      <button @click="exportReport" class="export-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Export Laporan
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthlyReport',
  data() {
    return {
      selectedMonth: new Date().toISOString().slice(0, 7),
      totalIncome: 2500000,
      totalExpense: 1200000,
      incomeDetails: [
        {
          id: 1,
          date: '2024-01-15',
          description: 'Service AC Regular',
          amount: 1500000
        },
        {
          id: 2,
          date: '2024-01-20',
          description: 'Perbaikan AC',
          amount: 1000000
        }
      ],
      expenseDetails: [
        {
          id: 1,
          date: '2024-01-16',
          description: 'Freon R32',
          category: 'Sparepart',
          amount: 500000
        },
        {
          id: 2,
          date: '2024-01-18',
          description: 'Kapasitor',
          category: 'Sparepart',
          amount: 700000
        }
      ]
    }
  },
  computed: {
    totalProfit() {
      return this.totalIncome - this.totalExpense
    }
  },
  methods: {
    formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID')
    },
    generateReport() {
      // Implement report generation logic here
      console.log('Generating report for', this.selectedMonth)
    },
    exportReport() {
      // Implement export functionality here
      console.log('Exporting report...')
    }
  }
}
</script>

<style scoped>
.monthly-report {
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

.month-filter {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.month-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.card.income .card-icon {
  color: #4CAF50;
}

.card.expense .card-icon {
  color: #f44336;
}

.card.profit .card-icon {
  color: #2196F3;
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

.charts-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.chart-container h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.chart-placeholder {
  height: 300px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.detailed-reports {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.report-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
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

.export-section {
  display: flex;
  justify-content: flex-end;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #1976D2;
}
</style>