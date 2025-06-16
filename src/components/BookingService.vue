<template>
  <div class="booking-service">
    <!-- Header -->
    <header class="booking-header">
      <div class="header-content">
        <div class="header-left">
          <h1>Booking Service AC</h1>
          <p>Schedule your AC service appointment</p>
        </div>
        <div class="header-center">
          <nav class="nav-links">
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <router-link to="/contact" class="nav-link">Contact</router-link>
            <router-link to="/product" class="nav-link">Menu Produk</router-link>
            <router-link to="/booking-service" class="nav-link active">Booking Service AC</router-link>
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
    <main class="booking-main">
      <!-- Service Selection -->
      <section class="service-selection">
        <div class="service-card">
          <h2>Select AC Service Type</h2>
          <div class="service-options">
            <div class="service-option" 
                 v-for="service in serviceTypes" 
                 :key="service.id"
                 :class="{ active: selectedService === service.id }"
                 @click="selectService(service.id)">
              <div class="service-icon">
                <i :class="service.icon"></i>
              </div>
              <div class="service-info">
                <h3>{{ service.name }}</h3>
                <p>{{ service.description }}</p>
                <span class="service-price">{{ service.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Calendar Section -->
      <section class="calendar-section">
        <div class="calendar-card">
          <div class="calendar-header">
            <h2>Schedule Appointment</h2>
            <div class="calendar-nav">
              <button @click="previousMonth" class="nav-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <h3>{{ currentMonthYear }}</h3>
              <button @click="nextMonth" class="nav-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="calendar-grid">
            <div class="calendar-weekdays">
              <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
            </div>
            
            <div class="calendar-days">
              <div class="calendar-day" 
                   v-for="day in calendarDays" 
                   :key="day.date"
                   :class="{
                     'other-month': !day.currentMonth,
                     'today': day.isToday,
                     'selected': day.date === selectedDate,
                     'has-appointment': day.hasAppointment,
                     'available': day.available
                   }"
                   @click="selectDate(day)">
                <span class="day-number">{{ day.day }}</span>
                <div class="day-appointments" v-if="day.appointments">
                  <div class="appointment-dot" v-for="apt in day.appointments" :key="apt.id"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Time Slots -->
      <section class="time-slots-section" v-if="selectedDate">
        <div class="time-slots-card">
          <h2>Available Time Slots</h2>
          <div class="time-slots-grid">
            <button class="time-slot" 
                    v-for="slot in availableTimeSlots" 
                    :key="slot.time"
                    :class="{ active: selectedTimeSlot === slot.time, disabled: !slot.available }"
                    :disabled="!slot.available"
                    @click="selectTimeSlot(slot.time)">
              {{ slot.time }}
              <span v-if="!slot.available" class="slot-status">Booked</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Booking Form -->
      <section class="booking-form-section" v-if="selectedDate && selectedTimeSlot">
        <div class="booking-form-card">
          <h2>Booking Details</h2>
          <form @submit.prevent="submitBooking" class="booking-form">
            <div class="form-group">
              <label for="customerName">Customer Name</label>
              <input type="text" id="customerName" v-model="bookingForm.customerName" required>
            </div>
            
            <div class="form-group">
              <label for="customerPhone">Phone Number</label>
              <input type="tel" id="customerPhone" v-model="bookingForm.customerPhone" required>
            </div>
            
            <div class="form-group">
              <label for="customerAddress">Address</label>
              <textarea id="customerAddress" v-model="bookingForm.customerAddress" rows="3" required></textarea>
            </div>
            
            <div class="form-group">
              <label for="acType">AC Type/Brand</label>
              <input type="text" id="acType" v-model="bookingForm.acType" placeholder="e.g., Daikin Split AC">
            </div>
            
            <div class="form-group">
              <label for="notes">Additional Notes</label>
              <textarea id="notes" v-model="bookingForm.notes" rows="2" placeholder="Any specific issues or requests"></textarea>
            </div>
            
            <div class="booking-summary">
              <h3>Booking Summary</h3>
              <div class="summary-item">
                <span>Service:</span>
                <span>{{ getSelectedServiceName() }}</span>
              </div>
              <div class="summary-item">
                <span>Date:</span>
                <span>{{ formatSelectedDate() }}</span>
              </div>
              <div class="summary-item">
                <span>Time:</span>
                <span>{{ selectedTimeSlot }}</span>
              </div>
              <div class="summary-item total">
                <span>Total Price:</span>
                <span>{{ getSelectedServicePrice() }}</span>
              </div>
            </div>
            
            <button type="submit" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? 'Booking...' : 'Confirm Booking' }}
            </button>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'BookingService',
  data() {
    return {
      userInfo: {
        name: 'John Doe',
        role: 'Customer',
        initials: 'JD'
      },
      selectedService: null,
      selectedDate: null,
      selectedTimeSlot: null,
      currentDate: new Date(),
      isSubmitting: false,
      serviceTypes: [
        {
          id: 1,
          name: 'AC Cleaning',
          description: 'Deep cleaning of AC unit including filters and coils',
          price: 'Rp 150,000',
          icon: 'fas fa-broom'
        },
        {
          id: 2,
          name: 'AC Repair',
          description: 'Diagnosis and repair of AC issues',
          price: 'Rp 200,000',
          icon: 'fas fa-tools'
        },
        {
          id: 3,
          name: 'AC Installation',
          description: 'Professional AC installation service',
          price: 'Rp 500,000',
          icon: 'fas fa-cog'
        },
        {
          id: 4,
          name: 'AC Maintenance',
          description: 'Regular maintenance and check-up',
          price: 'Rp 100,000',
          icon: 'fas fa-wrench'
        }
      ],
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      availableTimeSlots: [
        { time: '08:00', available: true },
        { time: '09:00', available: true },
        { time: '10:00', available: false },
        { time: '11:00', available: true },
        { time: '13:00', available: true },
        { time: '14:00', available: true },
        { time: '15:00', available: false },
        { time: '16:00', available: true }
      ],
      bookingForm: {
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        acType: '',
        notes: ''
      }
    }
  },
  computed: {
    currentMonthYear() {
      return this.currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },
    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const days = []
      const today = new Date()
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        
        const isCurrentMonth = date.getMonth() === month
        const isToday = date.toDateString() === today.toDateString()
        const hasAppointment = Math.random() > 0.8 // Random appointments for demo
        
        days.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          currentMonth: isCurrentMonth,
          isToday: isToday,
          hasAppointment: hasAppointment,
          available: isCurrentMonth && date >= today,
          appointments: hasAppointment ? [{ id: 1 }] : null
        })
      }
      
      return days
    }
  },
  methods: {
    selectService(serviceId) {
      this.selectedService = serviceId
    },
    selectDate(day) {
      if (day.available) {
        this.selectedDate = day.date
        this.selectedTimeSlot = null
      }
    },
    selectTimeSlot(time) {
      this.selectedTimeSlot = time
    },
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    },
    getSelectedServiceName() {
      const service = this.serviceTypes.find(s => s.id === this.selectedService)
      return service ? service.name : ''
    },
    getSelectedServicePrice() {
      const service = this.serviceTypes.find(s => s.id === this.selectedService)
      return service ? service.price : ''
    },
    formatSelectedDate() {
      if (!this.selectedDate) return ''
      return new Date(this.selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async submitBooking() {
      this.isSubmitting = true
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Booking confirmed! You will receive a confirmation message shortly.')
      
      // Reset form
      this.selectedService = null
      this.selectedDate = null
      this.selectedTimeSlot = null
      this.bookingForm = {
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        acType: '',
        notes: ''
      }
      
      this.isSubmitting = false
    },
    logout() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.booking-service {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header Styles */
.booking-header {
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
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
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
.booking-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Service Selection */
.service-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.service-card h2 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.service-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.service-option {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.service-option:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.service-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.service-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.service-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.service-info p {
  margin: 0 0 0.5rem 0;
  color: #718096;
  font-size: 0.9rem;
}

.service-price {
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Calendar Styles */
.calendar-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.calendar-nav h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.2rem;
  min-width: 200px;
  text-align: center;
}

.calendar-grid {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f7fafc;
}

.weekday {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #4a5568;
  border-right: 1px solid #e2e8f0;
}

.weekday:last-child {
  border-right: none;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 80px;
  padding: 0.5rem;
  border-right: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day:hover {
  background: rgba(102, 126, 234, 0.05);
}

.calendar-day.available:hover {
  background: rgba(102, 126, 234, 0.1);
}

.calendar-day.selected {
  background: #667eea;
  color: white;
}

.calendar-day.today {
  background: rgba(229, 62, 62, 0.1);
}

.calendar-day.other-month {
  color: #cbd5e0;
  cursor: not-allowed;
}

.calendar-day.other-month:hover {
  background: transparent;
}

.day-number {
  font-weight: 600;
  font-size: 1rem;
}

.day-appointments {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
}

.appointment-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #667eea;
}

/* Time Slots */
.time-slots-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.time-slots-card h2 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.time-slot {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
}

.time-slot:hover:not(:disabled) {
  border-color: #667eea;
  transform: translateY(-2px);
}

.time-slot.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.time-slot:disabled {
  background: #f7fafc;
  color: #cbd5e0;
  cursor: not-allowed;
}

.slot-status {
  font-size: 0.8rem;
  color: #e53e3e;
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
}

/* Booking Form */
.booking-form-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.booking-form-card h2 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
}

.booking-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.booking-summary {
  grid-column: 1 / -1;
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.booking-summary h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.summary-item.total {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2d3748;
  border-top: 1px solid #e2e8f0;
  padding-top: 0.5rem;
  margin-top: 1rem;
}

.submit-btn {
  grid-column: 1 / -1;
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
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
  }
  
  .booking-main {
    padding: 1rem;
  }
  
  .service-options {
    grid-template-columns: 1fr;
  }
  
  .calendar-nav {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .time-slots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .booking-form {
    grid-template-columns: 1fr;
  }
}
</style>