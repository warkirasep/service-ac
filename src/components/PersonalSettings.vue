<template>
  <div class="personal-settings">
    <div class="settings-container">
      <!-- Header -->
      <div class="settings-header">
        <h2>Pengaturan Profil</h2>
      </div>

      <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-picture">
          <div class="picture-container">
            <img v-if="profile.photoUrl" :src="profile.photoUrl" alt="Profile picture">
            <div v-else class="picture-placeholder">
              {{ getInitials(profile.name) }}
            </div>
          </div>
          <button class="change-photo-btn">Ubah Foto</button>
        </div>

        <form @submit.prevent="saveProfile" class="profile-form">
          <!-- Personal Information -->
          <div class="form-section">
            <h3>Informasi Pribadi</h3>
            <div class="form-group">
              <label>Nama Lengkap</label>
              <input type="text" v-model="profile.name" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="profile.email" required>
            </div>
            <div class="form-group">
              <label>Nomor Telepon</label>
              <input type="tel" v-model="profile.phone" required>
            </div>
            <div class="form-group">
              <label>Alamat</label>
              <textarea v-model="profile.address" rows="3"></textarea>
            </div>
          </div>

          <!-- Account Settings -->
          <div class="form-section">
            <h3>Pengaturan Akun</h3>
            <div class="form-group">
              <label>Bahasa</label>
              <select v-model="profile.language">
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
            <div class="form-group">
              <label>Zona Waktu</label>
              <select v-model="profile.timezone">
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
              </select>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="form-section">
            <h3>Pengaturan Notifikasi</h3>
            <div class="form-group checkbox">
              <label class="checkbox-label">
                <input type="checkbox" v-model="profile.notifications.email">
                Terima notifikasi email
              </label>
            </div>
            <div class="form-group checkbox">
              <label class="checkbox-label">
                <input type="checkbox" v-model="profile.notifications.sms">
                Terima notifikasi SMS
              </label>
            </div>
            <div class="form-group checkbox">
              <label class="checkbox-label">
                <input type="checkbox" v-model="profile.notifications.whatsapp">
                Terima notifikasi WhatsApp
              </label>
            </div>
          </div>

          <!-- Security Settings -->
          <div class="form-section">
            <h3>Keamanan</h3>
            <div class="form-group">
              <button type="button" @click="showChangePasswordModal = true" class="secondary-btn">
                Ubah Password
              </button>
            </div>
            <div class="form-group">
              <button type="button" @click="enable2FA" class="secondary-btn">
                Aktifkan Autentikasi 2 Faktor
              </button>
            </div>
          </div>

          <!-- Save Button -->
          <div class="form-actions">
            <button type="submit" class="save-btn">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="modal">
      <div class="modal-content">
        <h3>Ubah Password</h3>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>Password Lama</label>
            <input type="password" v-model="passwordForm.oldPassword" required>
          </div>
          <div class="form-group">
            <label>Password Baru</label>
            <input type="password" v-model="passwordForm.newPassword" required>
          </div>
          <div class="form-group">
            <label>Konfirmasi Password Baru</label>
            <input type="password" v-model="passwordForm.confirmPassword" required>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="showChangePasswordModal = false" class="cancel-btn">Batal</button>
            <button type="submit" class="submit-btn">Simpan Password</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalSettings',
  data() {
    return {
      profile: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+62812345678',
        address: 'Jl. Example No. 123, Jakarta',
        photoUrl: '',
        language: 'id',
        timezone: 'Asia/Jakarta',
        notifications: {
          email: true,
          sms: true,
          whatsapp: true
        }
      },
      showChangePasswordModal: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    getInitials(name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
    },
    saveProfile() {
      // Implement save profile logic here
      console.log('Saving profile:', this.profile)
    },
    changePassword() {
      // Implement change password logic here
      console.log('Changing password')
      this.showChangePasswordModal = false
    },
    enable2FA() {
      // Implement 2FA activation logic here
      console.log('Enabling 2FA')
    }
  }
}
</script>

<style scoped>
.personal-settings {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.settings-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.settings-header h2 {
  margin: 0;
  color: #333;
}

.profile-section {
  padding: 2rem;
}

.profile-picture {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.picture-container {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  background-color: #f0f0f0;
}

.picture-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #666;
  background-color: #e9ecef;
}

.change-photo-btn {
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.form-section h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #666;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.form-group input[type="password"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 0.5rem;
}

.secondary-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.save-btn {
  width: 100%;
  padding: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
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

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>