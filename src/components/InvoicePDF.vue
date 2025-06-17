<template>
  <div class="invoice-pdf-preview">
    <div class="preview-actions">
      <button @click="generatePDF" class="generate-btn">
        <i class="fas fa-file-pdf"></i> Generate PDF
      </button>
    </div>
    <div class="preview-container" ref="invoicePreview">
      <div class="invoice-header">
        <div class="company-info">
          <h2>PT. Service AC Professional</h2>
          <p>Jl. Contoh No. 123, Jakarta</p>
          <p>Telp: (021) 1234-5678</p>
          <p>Email: info@serviceacpro.com</p>
        </div>
        <div class="invoice-details">
          <h1>INVOICE</h1>
          <table>
            <tr>
              <td>No. Invoice:</td>
              <td>{{ invoice.number }}</td>
            </tr>
            <tr>
              <td>Tanggal:</td>
              <td>{{ formatDate(invoice.date) }}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="customer-info">
        <h3>Informasi Pelanggan</h3>
        <table>
          <tr>
            <td>Nama:</td>
            <td>{{ invoice.customer }}</td>
          </tr>
          <tr>
            <td>Alamat:</td>
            <td>{{ invoice.address }}</td>
          </tr>
          <tr>
            <td>Telepon:</td>
            <td>{{ invoice.phone }}</td>
          </tr>
        </table>
      </div>

      <div class="service-details">
        <h3>Detail Layanan</h3>
        <table class="service-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Deskripsi</th>
              <th>Qty</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in invoice.items" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.description }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.price) }}</td>
              <td>{{ formatCurrency(item.quantity * item.price) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4">Subtotal</td>
              <td>{{ formatCurrency(calculateSubtotal) }}</td>
            </tr>
            <tr>
              <td colspan="4">PPN (11%)</td>
              <td>{{ formatCurrency(calculateTax) }}</td>
            </tr>
            <tr class="total">
              <td colspan="4">Total</td>
              <td>{{ formatCurrency(calculateTotal) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="payment-info">
        <h3>Informasi Pembayaran</h3>
        <p>Silakan melakukan pembayaran ke:</p>
        <table>
          <tr>
            <td>Bank:</td>
            <td>Bank Contoh Indonesia</td>
          </tr>
          <tr>
            <td>No. Rekening:</td>
            <td>1234-5678-9012-3456</td>
          </tr>
          <tr>
            <td>Atas Nama:</td>
            <td>PT. Service AC Professional</td>
          </tr>
        </table>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <p>Hormat Kami,</p>
          <div class="signature-line"></div>
          <p>PT. Service AC Professional</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'InvoicePDF',
  data() {
    return {
      invoice: {
        number: '',
        date: '',
        customer: '',
        address: '',
        phone: '',
        items: []
      }
    }
  },
  created() {
    const invoiceData = this.$route.query.data
    if (invoiceData) {
      try {
        const parsedData = JSON.parse(invoiceData)
        this.invoice = {
          ...this.invoice,
          ...parsedData
        }
      } catch (error) {
        console.error('Error parsing invoice data:', error)
      }
    }
  },
  computed: {
    calculateSubtotal() {
      return (this.invoice.items || []).reduce((sum, item) => sum + (item.quantity * item.price), 0)
    },
    calculateTax() {
      return this.calculateSubtotal * 0.11
    },
    calculateTotal() {
      return this.calculateSubtotal + this.calculateTax
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(amount)
    },
    async generatePDF() {
      const element = this.$refs.invoicePreview
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      })
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`invoice-${this.invoice.number}.pdf`)
    }
  }
}
</script>

<style scoped>
.invoice-pdf-preview {
  padding: 2rem;
  background-color: #f8f9fa;
}

.preview-actions {
  margin-bottom: 2rem;
  text-align: right;
}

.generate-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-container {
  background-color: white;
  padding: 3rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 210mm;
  margin: 0 auto;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.company-info h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.company-info p {
  margin: 0.25rem 0;
  color: #666;
}

.invoice-details h1 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.invoice-details table td {
  padding: 0.25rem 0;
}

.invoice-details table td:first-child {
  padding-right: 1rem;
  font-weight: 500;
}

.customer-info,
.service-details,
.payment-info {
  margin-bottom: 2rem;
}

.customer-info h3,
.service-details h3,
.payment-info h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eee;
}

.service-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.service-table th,
.service-table td {
  padding: 0.75rem;
  text-align: left;
  border: 1px solid #dee2e6;
}

.service-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.service-table tfoot tr {
  background-color: #f8f9fa;
}

.service-table tfoot tr.total {
  font-weight: 700;
  color: #dc3545;
}

.payment-info table td {
  padding: 0.25rem 0;
}

.payment-info table td:first-child {
  font-weight: 500;
  padding-right: 1rem;
}

.signature-section {
  margin-top: 4rem;
  text-align: right;
}

.signature-box {
  display: inline-block;
  text-align: center;
}

.signature-line {
  width: 200px;
  height: 1px;
  background-color: #000;
  margin: 4rem auto 1rem;
}
</style>