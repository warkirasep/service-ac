<template>
  <div class="order-service">
    <!-- Header -->
    <header class="order-header">
      <div class="header-content">
        <div class="header-left">
          <h1>Order Service AC</h1>
          <p>Manage and track your AC service orders</p>
        </div>
        <div class="header-center">
          <nav class="nav-links">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/contact" class="nav-link">Contact</router-link>
            <router-link to="/product" class="nav-link">Menu Produk</router-link>
            <router-link to="/booking-service" class="nav-link">Booking Service AC</router-link>
            <router-link to="/order-service" class="nav-link active">Order Service AC</router-link>
          </nav>
        </div>
        <div class="header-right">
          <div class="user-profile">
            <div class="avatar">
              <span>{{ userInfo.initials }}</span>
            </div>
            <div class="user-info">
              <span class="user-name">{{ userInfo.name }}</span>
              <span class="user-role">{{ userInfo.role }}</span>
            </div>
            <button @click="logout" class="logout-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="order-main">
      <!-- Quick Actions -->
      <section class="quick-actions">
        <div class="actions-card">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <button class="action-btn" @click="showNewOrderModal = true">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span>New Order</span>
            </button>
            
            <button class="action-btn" @click="activeTab = 'pending'">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
              </div>
              <span>Pending Orders</span>
            </button>
            
            <button class="action-btn" @click="activeTab = 'history'">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM12 6V12L16 14L15 15.5L10.5 13V6H12Z" fill="currentColor"/>
                </svg>
              </div>
              <span>Order History</span>
            </button>
            
            <button class="action-btn" @click="activeTab = 'tracking'">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Order Statistics -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon pending">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ orderStats.pending }}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon progress">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ orderStats.inProgress }}</h3>
              <p>In Progress</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon completed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ orderStats.completed }}</h3>
              <p>Completed</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon total">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ orderStats.total }}</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Order Tabs -->
      <section class="order-tabs-section">
        <div class="tabs-card">
          <div class="tabs-header">
            <div class="tabs-nav">
              <button class="tab-btn" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">
                Pending Orders
              </button>
              <button class="tab-btn" :class="{ active: activeTab === 'progress' }" @click="activeTab = 'progress'">
                In Progress
              </button>
              <button class="tab-btn" :class="{ active: activeTab === 'completed' }" @click="activeTab = 'completed'">
                Completed
              </button>
              <button class="tab-btn" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">
                Order History
              </button>
              <button class="tab-btn" :class="{ active: activeTab === 'tracking' }" @click="activeTab = 'tracking'">
                Track Order
              </button>
            </div>
            <div class="search-filter">
              <input type="text" v-model="searchQuery" placeholder="Search orders..." class="search-input">
              <select v-model="filterStatus" class="filter-select">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <!-- Orders List -->
          <div class="orders-content">
            <div v-if="activeTab === 'tracking'" class="tracking-section">
              <div class="tracking-input">
                <h3>Track Your Order</h3>
                <div class="track-form">
                  <input type="text" v-model="trackingId" placeholder="Enter Order ID" class="tracking-input-field">
                  <button @click="trackOrder" class="track-btn">Track Order</button>
                </div>
              </div>
              
              <div v-if="trackedOrder" class="tracking-result">
                <div class="order-info">
                  <h4>Order #{{ trackedOrder.id }}</h4>
                  <p>{{ trackedOrder.service }} - {{ trackedOrder.customerName }}</p>
                </div>
                
                <div class="tracking-timeline">
                  <div class="timeline-item" v-for="(step, index) in trackedOrder.timeline" :key="index" :class="{ completed: step.completed, active: step.active }">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <h5>{{ step.title }}</h5>
                      <p>{{ step.description }}</p>
                      <span class="timeline-time">{{ step.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="orders-list">
              <div class="order-item" v-for="order in filteredOrders" :key="order.id">
                <div class="order-header">
                  <div class="order-id">
                    <h4>Order #{{ order.id }}</h4>
                    <span class="order-status" :class="order.status">{{ formatStatus(order.status) }}</span>
                  </div>
                  <div class="order-date">{{ formatDate(order.date) }}</div>
                </div>
                
                <div class="order-details">
                  <div class="order-info">
                    <div class="info-item">
                      <span class="label">Service:</span>
                      <span class="value">{{ order.service }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Customer:</span>
                      <span class="value">{{ order.customerName }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Phone:</span>
                      <span class="value">{{ order.customerPhone }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Address:</span>
                      <span class="value">{{ order.address }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Scheduled:</span>
                      <span class="value">{{ order.scheduledDate }} at {{ order.scheduledTime }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Price:</span>
                      <span class="value price">{{ order.price }}</span>
                    </div>
                  </div>
                  
                  <div class="order-actions">
                    <button v-if="order.status === 'pending'" @click="confirmOrder(order.id)" class="action-btn-small confirm">
                      Confirm
                    </button>
                    <button v-if="order.status === 'confirmed'" @click="startService(order.id)" class="action-btn-small start">
                      Start Service
                    </button>
                    <button v-if="order.status === 'in-progress'" @click="completeOrder(order.id)" class="action-btn-small complete">
                      Complete
                    </button>
                    <button @click="viewOrderDetails(order)" class="action-btn-small view">
                      View Details
                    </button>
                    <button v-if="order.status === 'pending'" @click="cancelOrder(order.id)" class="action-btn-small cancel">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-if="filteredOrders.length === 0" class="no-orders">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="#cbd5e0"/>
                </svg>
                <h3>No orders found</h3>
                <p>{{ getNoOrdersMessage() }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- New Order Modal -->
    <div v-if="showNewOrderModal" class="modal-overlay" @click="showNewOrderModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Create New Order</h3>
          <button @click="showNewOrderModal = false" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="createOrder" class="order-form">
          <div class="form-row">
            <div class="form-group">
              <label>Service Type</label>
              <select v-model="newOrder.service" required>
                <option value="">Select Service</option>
                <option value="AC Cleaning">AC Cleaning</option>
                <option value="AC Repair">AC Repair</option>
                <option value="AC Installation">AC Installation</option>
                <option value="AC Maintenance">AC Maintenance</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Priority</label>
              <select v-model="newOrder.priority">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Customer Name</label>
              <input type="text" v-model="newOrder.customerName" required>
            </div>
            
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" v-model="newOrder.customerPhone" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="newOrder.address" rows="3" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Scheduled Date</label>
              <input type="date" v-model="newOrder.scheduledDate" required>
            </div>
            
            <div class="form-group">
              <label>Scheduled Time</label>
              <input type="time" v-model="newOrder.scheduledTime" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Notes</label>
            <textarea v-model="newOrder.notes" rows="2" placeholder="Additional notes or special instructions"></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="showNewOrderModal = false" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Create Order</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderService',
  data() {
    return {
      userInfo: {
        name: 'John Doe',
        role: 'Admin',
        initials: 'JD'
      },
      activeTab: 'pending',
      searchQuery: '',
      filterStatus: '',
      showNewOrderModal: false,
      trackingId: '',
      trackedOrder: null,
      orderStats: {
        pending: 8,
        inProgress: 5,
        completed: 23,
        total: 36
      },
      newOrder: {
        service: '',
        priority: 'normal',
        customerName: '',
        customerPhone: '',
        address: '',
        scheduledDate: '',
        scheduledTime: '',
        notes: ''
      },
      orders: [
        {
          id: 'ORD001',
          service: 'AC Cleaning',
          customerName: 'Ahmad Wijaya',
          customerPhone: '+62 812-3456-7890',
          address: 'Jl. Sudirman No. 123, Jakarta',
          scheduledDate: '2024-01-15',
          scheduledTime: '09:00',
          price: 'Rp 150,000',
          status: 'pending',
          date: '2024-01-10',
          priority: 'normal'
        },
        {
          id: 'ORD002',
          service: 'AC Repair',
          customerName: 'Siti Nurhaliza',
          customerPhone: '+62 813-9876-5432',
          address: 'Jl. Thamrin No. 456, Jakarta',
          scheduledDate: '2024-01-16',
          scheduledTime: '14:00',
          price: 'Rp 200,000',
          status: 'confirmed',
          date: '2024-01-11',
          priority: 'urgent'
        },
        {
          id: 'ORD003',
          service: 'AC Installation',
          customerName: 'Budi Santoso',
          customerPhone: '+62 814-1111-2222',
          address: 'Jl. Gatot Subroto No. 789, Jakarta',
          scheduledDate: '2024-01-17',
          scheduledTime: '10:00',
          price: 'Rp 500,000',
          status: 'in-progress',
          date: '2024-01-12',
          priority: 'normal'
        },
        {
          id: 'ORD004',
          service: 'AC Maintenance',
          customerName: 'Dewi Sartika',
          customerPhone: '+62 815-3333-4444',
          address: 'Jl. Kuningan No. 321, Jakarta',
          scheduledDate: '2024-01-14',
          scheduledTime: '11:00',
          price: 'Rp 100,000',
          status: 'completed',
          date: '2024-01-09',
          priority: 'normal'
        },
        {
          id: 'ORD005',
          service: 'AC Cleaning',
          customerName: 'Eko Prasetyo',
          customerPhone: '+62 816-5555-6666',
          address: 'Jl. Senayan No. 654, Jakarta',
          scheduledDate: '2024-01-18',
          scheduledTime: '15:00',
          price: 'Rp 150,000',
          status: 'pending',
          date: '2024-01-13',
          priority: 'emergency'
        }
      ]
    }
  },
  computed: {
    filteredOrders() {
      let filtered = this.orders
      
      // Filter by active tab
      if (this.activeTab === 'pending') {
        filtered = filtered.filter(order => order.status === 'pending')
      } else if (this.activeTab === 'progress') {
        filtered = filtered.filter(order => order.status === 'confirmed' || order.status === 'in-progress')
      } else if (this.activeTab === 'completed') {
        filtered = filtered.filter(order => order.status === 'completed')
      }
      
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(order => 
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.service.toLowerCase().includes(query)
        )
      }
      
      // Filter by status
      if (this.filterStatus) {
        filtered = filtered.filter(order => order.status === this.filterStatus)
      }
      
      return filtered
    }
  },
  methods: {
    formatStatus(status) {
      return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    getNoOrdersMessage() {
      if (this.activeTab === 'pending') return 'No pending orders at the moment.'
      if (this.activeTab === 'progress') return 'No orders in progress.'
      if (this.activeTab === 'completed') return 'No completed orders found.'
      if (this.activeTab === 'history') return 'No order history available.'
      return 'No orders found matching your criteria.'
    },
    confirmOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = 'confirmed'
        this.updateStats()
        alert(`Order ${orderId} has been confirmed!`)
      }
    },
    startService(orderId) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = 'in-progress'
        this.updateStats()
        alert(`Service for order ${orderId} has started!`)
      }
    },
    completeOrder(orderId) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = 'completed'
        this.updateStats()
        alert(`Order ${orderId} has been completed!`)
      }
    },
    cancelOrder(orderId) {
      if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
        const orderIndex = this.orders.findIndex(o => o.id === orderId)
        if (orderIndex > -1) {
          this.orders.splice(orderIndex, 1)
          this.updateStats()
          alert(`Order ${orderId} has been cancelled.`)
        }
      }
    },
    viewOrderDetails(order) {
      alert(`Order Details:\n\nID: ${order.id}\nService: ${order.service}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nAddress: ${order.address}\nScheduled: ${order.scheduledDate} at ${order.scheduledTime}\nPrice: ${order.price}\nStatus: ${this.formatStatus(order.status)}`)
    },
    trackOrder() {
      if (!this.trackingId) {
        alert('Please enter an Order ID to track.')
        return
      }
      
      const order = this.orders.find(o => o.id === this.trackingId.toUpperCase())
      if (order) {
        this.trackedOrder = {
          ...order,
          timeline: this.generateTimeline(order.status)
        }
      } else {
        alert('Order not found. Please check the Order ID and try again.')
        this.trackedOrder = null
      }
    },
    generateTimeline(status) {
      const timeline = [
        {
          title: 'Order Placed',
          description: 'Your order has been received and is being processed.',
          time: '2024-01-10 10:30 AM',
          completed: true,
          active: false
        },
        {
          title: 'Order Confirmed',
          description: 'Your order has been confirmed and scheduled.',
          time: status !== 'pending' ? '2024-01-10 11:15 AM' : '',
          completed: status !== 'pending',
          active: status === 'confirmed'
        },
        {
          title: 'Service in Progress',
          description: 'Our technician is working on your AC service.',
          time: status === 'in-progress' || status === 'completed' ? '2024-01-15 09:00 AM' : '',
          completed: status === 'completed',
          active: status === 'in-progress'
        },
        {
          title: 'Service Completed',
          description: 'Your AC service has been completed successfully.',
          time: status === 'completed' ? '2024-01-15 11:30 AM' : '',
          completed: status === 'completed',
          active: false
        }
      ]
      
      return timeline
    },
    createOrder() {
      const newId = 'ORD' + String(this.orders.length + 1).padStart(3, '0')
      const order = {
        id: newId,
        ...this.newOrder,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        price: this.getServicePrice(this.newOrder.service)
      }
      
      this.orders.unshift(order)
      this.updateStats()
      
      // Reset form
      this.newOrder = {
        service: '',
        priority: 'normal',
        customerName: '',
        customerPhone: '',
        address: '',
        scheduledDate: '',
        scheduledTime: '',
        notes: ''
      }
      
      this.showNewOrderModal = false
      alert(`Order ${newId} has been created successfully!`)
    },
    getServicePrice(service) {
      const prices = {
        'AC Cleaning': 'Rp 150,000',
        'AC Repair': 'Rp 200,000',
        'AC Installation': 'Rp 500,000',
        'AC Maintenance': 'Rp 100,000'
      }
      return prices[service] || 'Rp 0'
    },
    updateStats() {
      this.orderStats.pending = this.orders.filter(o => o.status === 'pending').length
      this.orderStats.inProgress = this.orders.filter(o => o.status === 'confirmed' || o.status === 'in-progress').length
      this.orderStats.completed = this.orders.filter(o => o.status === 'completed').length
      this.orderStats.total = this.orders.length
    },
    logout() {
      this.$router.push('/')
    }
  },
  mounted() {
    this.updateStats()
  }
}
</script>

<style scoped>
.order-service {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
.order-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0;
  color: #2d3748;
  font-size: 1.8rem;
  font-weight: 700;
}

.header-left p {
  margin: 0.25rem 0 0 0;
  color: #718096;
  font-size: 0.9rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.nav-link.active {
  background: #667eea;
  color: white;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.8rem;
  color: #718096;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c53030;
}

/* Main Content */
.order-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Quick Actions */
.actions-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.actions-card h2 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.action-btn:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.action-btn:hover .action-icon {
  background: white;
  color: #667eea;
}

/* Statistics */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-icon.pending {
  background: #f6ad55;
}

.stat-icon.progress {
  background: #4299e1;
}

.stat-icon.completed {
  background: #48bb78;
}

.stat-icon.total {
  background: #667eea;
}

.stat-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-content p {
  margin: 0.25rem 0 0 0;
  color: #718096;
  font-size: 0.9rem;
}

/* Tabs */
.tabs-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.tabs-nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #4a5568;
}

.tab-btn:hover {
  background: #edf2f7;
}

.tab-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.search-filter {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input,
.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
}

.search-input {
  min-width: 200px;
}

/* Orders Content */
.orders-content {
  padding: 2rem;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.order-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-id h4 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.order-status.pending {
  background: #fed7d7;
  color: #c53030;
}

.order-status.confirmed {
  background: #bee3f8;
  color: #2b6cb0;
}

.order-status.in-progress {
  background: #feebc8;
  color: #c05621;
}

.order-status.completed {
  background: #c6f6d5;
  color: #2f855a;
}

.order-date {
  color: #718096;
  font-size: 0.9rem;
}

.order-details {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.order-info {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
}

.info-item .label {
  font-weight: 600;
  color: #4a5568;
  min-width: 80px;
}

.info-item .value {
  color: #2d3748;
}

.info-item .value.price {
  color: #667eea;
  font-weight: 600;
}

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn-small {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 100px;
}

.action-btn-small.confirm {
  background: #48bb78;
  color: white;
}

.action-btn-small.start {
  background: #4299e1;
  color: white;
}

.action-btn-small.complete {
  background: #667eea;
  color: white;
}

.action-btn-small.view {
  background: #edf2f7;
  color: #4a5568;
}

.action-btn-small.cancel {
  background: #fed7d7;
  color: #c53030;
}

.action-btn-small:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

/* No Orders */
.no-orders {
  text-align: center;
  padding: 3rem;
  color: #718096;
}

.no-orders h3 {
  margin: 1rem 0 0.5rem 0;
  color: #4a5568;
}

/* Tracking Section */
.tracking-section {
  max-width: 800px;
  margin: 0 auto;
}

.tracking-input h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  text-align: center;
}

.track-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tracking-input-field {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.track-btn {
  padding: 0.75rem 2rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.track-btn:hover {
  background: #5a67d8;
}

.tracking-result {
  background: #f7fafc;
  border-radius: 12px;
  padding: 2rem;
}

.order-info h4 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.2rem;
}

.order-info p {
  margin: 0 0 2rem 0;
  color: #718096;
}

.tracking-timeline {
  position: relative;
}

.tracking-timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
}

.timeline-item {
  position: relative;
  padding-left: 60px;
  margin-bottom: 2rem;
}

.timeline-dot {
  position: absolute;
  left: 12px;
  top: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e2e8f0;
  border: 4px solid white;
  box-shadow: 0 0 0 2px #e2e8f0;
}

.timeline-item.completed .timeline-dot {
  background: #48bb78;
  box-shadow: 0 0 0 2px #48bb78;
}

.timeline-item.active .timeline-dot {
  background: #667eea;
  box-shadow: 0 0 0 2px #667eea;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 2px #667eea, 0 0 0 4px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 0 2px #667eea, 0 0 0 8px rgba(102, 126, 234, 0.1);
  }
  100% {
    box-shadow: 0 0 0 2px #667eea, 0 0 0 4px rgba(102, 126, 234, 0.3);
  }
}

.timeline-content h5 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1rem;
}

.timeline-content p {
  margin: 0 0 0.5rem 0;
  color: #718096;
  font-size: 0.9rem;
}

.timeline-time {
  color: #a0aec0;
  font-size: 0.8rem;
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
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #f7fafc;
}

.order-form {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e2e8f0;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #5a67d8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .order-main {
    padding: 1rem;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-filter {
    flex-direction: column;
  }
  
  .order-details {
    flex-direction: column;
    gap: 1rem;
  }
  
  .order-info {
    grid-template-columns: 1fr;
  }
  
  .order-actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .track-form {
    flex-direction: column;
  }
}
</style>