<template>
  <div class="otp-container">
    <div class="otp-card">
      <div class="otp-header">
        <div class="icon-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="#667eea"/>
          </svg>
        </div>
        <h2>Verify Your Account</h2>
        <p>We've sent a 6-digit verification code to your email</p>
        <p class="email-display">{{ maskedEmail }}</p>
      </div>
      
      <form @submit.prevent="handleVerifyOTP" class="otp-form">
        <div class="otp-input-container">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            :ref="el => otpInputs[index] = el"
            v-model="otpDigits[index]"
            @input="handleInput(index, $event)"
            @keydown="handleKeydown(index, $event)"
            @paste="handlePaste($event)"
            type="text"
            maxlength="1"
            class="otp-input"
            :class="{ 'error': hasError }"
          />
        </div>
        
        <div v-if="hasError" class="error-message">
          Invalid verification code. Please try again.
        </div>
        
        <button type="submit" class="verify-btn" :disabled="isLoading || !isOTPComplete">
          <span v-if="isLoading">Verifying...</span>
          <span v-else>Verify Code</span>
        </button>
      </form>
      
      <div class="otp-footer">
        <p>Didn't receive the code?</p>
        <button @click="resendOTP" class="resend-btn" :disabled="resendCooldown > 0">
          <span v-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</span>
          <span v-else>Resend Code</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const isLoading = ref(false)
const hasError = ref(false)
const resendCooldown = ref(0)
let resendTimer = null

const maskedEmail = ref('user@example.com')

const isOTPComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '')
})

const handleInput = (index, event) => {
  const value = event.target.value
  
  // Only allow numbers
  if (!/^[0-9]$/.test(value) && value !== '') {
    event.target.value = ''
    otpDigits.value[index] = ''
    return
  }
  
  otpDigits.value[index] = value
  hasError.value = false
  
  // Move to next input if current is filled
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handleKeydown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')
  const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')
  
  digits.forEach((digit, index) => {
    if (index < 6) {
      otpDigits.value[index] = digit
    }
  })
  
  // Focus on the next empty input or the last one
  const nextEmptyIndex = otpDigits.value.findIndex(digit => digit === '')
  const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
  otpInputs.value[focusIndex]?.focus()
}

const handleVerifyOTP = async () => {
  if (!isOTPComplete.value) return
  
  isLoading.value = true
  hasError.value = false
  
  const otpCode = otpDigits.value.join('')
  
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    
    // For demo purposes, accept '123456' as valid OTP
    if (otpCode === '123456') {
      // Navigate to dashboard after successful verification
      router.push('/dashboard')
    } else {
      hasError.value = true
      // Clear the inputs
      otpDigits.value = ['', '', '', '', '', '']
      otpInputs.value[0]?.focus()
    }
  }, 1500)
}

const resendOTP = () => {
  if (resendCooldown.value > 0) return
  
  // Simulate resending OTP
  alert('New verification code sent to your email!')
  
  // Start cooldown
  resendCooldown.value = 60
  resendTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer)
    }
  }, 1000)
}

onMounted(() => {
  // Focus on first input when component mounts
  otpInputs.value[0]?.focus()
})

onUnmounted(() => {
  if (resendTimer) {
    clearInterval(resendTimer)
  }
})
</script>

<style scoped>
.otp-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.otp-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.otp-header {
  text-align: center;
  margin-bottom: 32px;
}

.icon-container {
  margin-bottom: 16px;
}

.otp-header h2 {
  color: #2d3748;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.otp-header p {
  color: #718096;
  font-size: 16px;
  margin: 0 0 8px 0;
}

.email-display {
  color: #667eea !important;
  font-weight: 600 !important;
  font-size: 14px !important;
}

.otp-form {
  margin-bottom: 24px;
}

.otp-input-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}

.otp-input {
  width: 50px;
  height: 50px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: #f7fafc;
}

.otp-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.otp-input.error {
  border-color: #e53e3e;
  background: #fed7d7;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-message {
  color: #e53e3e;
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
  font-weight: 500;
}

.verify-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.verify-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.verify-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.otp-footer {
  text-align: center;
}

.otp-footer p {
  color: #718096;
  font-size: 14px;
  margin: 0 0 8px 0;
}

.resend-btn {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
  text-decoration: underline;
}

.resend-btn:hover:not(:disabled) {
  color: #764ba2;
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>