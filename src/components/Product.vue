<template>
  <div class="product-container">
    <!-- Header Section -->
    <div class="header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="icon-product">📦</i>
          Product Management
        </h1>
        <p class="page-subtitle">Manage your AC products and inventory</p>
      </div>
      <button class="btn-primary" @click="openAddModal">
        <i class="icon-plus">➕</i>
        Add New Product
      </button>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-filter-section">
      <div class="search-box">
        <i class="search-icon">🔍</i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products by name, brand, model, or SKU..."
          class="search-input"
        >
      </div>
      
      <div class="filter-controls">
        <select v-model="filterCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="split">Split AC</option>
          <option value="window">Window AC</option>
          <option value="central">Central AC</option>
          <option value="portable">Portable AC</option>
          <option value="parts">Spare Parts</option>
        </select>
        
        <select v-model="filterBrand" class="filter-select">
          <option value="">All Brands</option>
          <option value="daikin">Daikin</option>
          <option value="lg">LG</option>
          <option value="samsung">Samsung</option>
          <option value="panasonic">Panasonic</option>
          <option value="sharp">Sharp</option>
          <option value="mitsubishi">Mitsubishi</option>
        </select>
        
        <select v-model="sortBy" class="sort-select">
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="stock">Sort by Stock</option>
          <option value="created">Sort by Date Added</option>
        </select>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-number">{{ totalProducts }}</div>
        <div class="stat-label">Total Products</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ totalStock }}</div>
        <div class="stat-label">Total Stock</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ lowStockCount }}</div>
        <div class="stat-label">Low Stock Items</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">${{ totalValue.toLocaleString() }}</div>
        <div class="stat-label">Total Inventory Value</div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="bulk-actions" v-if="selectedProducts.length > 0">
      <button class="btn-secondary" @click="exportSelected">
        <i class="icon-export">📤</i>
        Export ({{ selectedProducts.length }})
      </button>
      <button class="btn-warning" @click="bulkUpdateStock">
        <i class="icon-update">🔄</i>
        Update Stock ({{ selectedProducts.length }})
      </button>
      <button class="btn-danger" @click="bulkDelete">
        <i class="icon-delete">🗑️</i>
        Delete ({{ selectedProducts.length }})
      </button>
    </div>

    <!-- Product Table -->
    <div class="table-container">
      <table class="product-table">
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
            <th class="image-column">Image</th>
            <th class="product-column">Product Details</th>
            <th class="price-column">Price</th>
            <th class="stock-column">Stock</th>
            <th class="category-column">Category</th>
            <th class="status-column">Status</th>
            <th class="date-column">Date Added</th>
            <th class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="product in paginatedProducts" 
            :key="product.id"
            class="product-row"
            :class="{ 'selected': selectedProducts.includes(product.id), 'low-stock': product.stock <= product.minStock }"
          >
            <td class="checkbox-column">
              <input 
                type="checkbox" 
                v-model="selectedProducts" 
                :value="product.id"
                class="checkbox"
              >
            </td>
            
            <td class="image-column">
              <div class="product-image">
                <img v-if="product.image" :src="product.image" :alt="product.name" />
                <div v-else class="image-placeholder">
                  <i class="icon-image">🖼️</i>
                </div>
              </div>
            </td>
            
            <td class="product-column">
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-details">
                  <span class="brand">{{ product.brand }}</span>
                  <span class="model">Model: {{ product.model }}</span>
                  <span class="sku">SKU: {{ product.sku }}</span>
                </div>
                <div class="product-specs" v-if="product.specifications">
                  {{ product.specifications }}
                </div>
              </div>
            </td>
            
            <td class="price-column">
              <div class="price-info">
                <div class="selling-price">${{ product.sellingPrice.toLocaleString() }}</div>
                <div class="cost-price" v-if="product.costPrice">
                  Cost: ${{ product.costPrice.toLocaleString() }}
                </div>
                <div class="profit-margin" v-if="product.costPrice">
                  Margin: {{ calculateMargin(product) }}%
                </div>
              </div>
            </td>
            
            <td class="stock-column">
              <div class="stock-info">
                <div class="current-stock" :class="{ 'low-stock': product.stock <= product.minStock }">
                  {{ product.stock }} units
                </div>
                <div class="min-stock">Min: {{ product.minStock }}</div>
                <div class="stock-status">
                  <span v-if="product.stock > product.minStock" class="status-good">✅ In Stock</span>
                  <span v-else class="status-warning">⚠️ Low Stock</span>
                </div>
              </div>
            </td>
            
            <td class="category-column">
              <span class="category-badge" :class="`category-${product.category}`">
                {{ formatCategory(product.category) }}
              </span>
            </td>
            
            <td class="status-column">
              <span class="status-badge" :class="`status-${product.status}`">
                {{ formatStatus(product.status) }}
              </span>
            </td>
            
            <td class="date-column">
              {{ formatDate(product.dateAdded) }}
            </td>
            
            <td class="actions-column">
              <div class="action-buttons">
                <button 
                  class="btn-icon btn-view" 
                  @click="viewProduct(product)"
                  title="View Details"
                >
                  👁️
                </button>
                <button 
                  class="btn-icon btn-edit" 
                  @click="editProduct(product)"
                  title="Edit Product"
                >
                  ✏️
                </button>
                <button 
                  class="btn-icon btn-stock" 
                  @click="updateStock(product)"
                  title="Update Stock"
                >
                  📊
                </button>
                <button 
                  class="btn-icon btn-delete" 
                  @click="deleteProduct(product.id)"
                  title="Delete Product"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No products found</h3>
        <p>Try adjusting your search criteria or add a new product.</p>
        <button class="btn-primary" @click="openAddModal">
          Add Your First Product
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
        ({{ totalProducts }} total products)
      </div>
      
      <button 
        class="btn-pagination" 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
      >
        Next →
      </button>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>
          <button class="btn-close" @click="closeModal">✕</button>
        </div>
        
        <form @submit.prevent="saveProduct" class="product-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Product Name *</label>
              <input 
                type="text" 
                id="name"
                v-model="currentProduct.name" 
                required
                class="form-input"
                placeholder="Enter product name"
              >
            </div>
            
            <div class="form-group">
              <label for="sku">SKU *</label>
              <input 
                type="text" 
                id="sku"
                v-model="currentProduct.sku" 
                required
                class="form-input"
                placeholder="Enter SKU"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="brand">Brand *</label>
              <select 
                id="brand"
                v-model="currentProduct.brand" 
                required
                class="form-select"
              >
                <option value="">Select brand</option>
                <option value="daikin">Daikin</option>
                <option value="lg">LG</option>
                <option value="samsung">Samsung</option>
                <option value="panasonic">Panasonic</option>
                <option value="sharp">Sharp</option>
                <option value="mitsubishi">Mitsubishi</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="model">Model</label>
              <input 
                type="text" 
                id="model"
                v-model="currentProduct.model" 
                class="form-input"
                placeholder="Enter model number"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="category">Category *</label>
              <select 
                id="category"
                v-model="currentProduct.category" 
                required
                class="form-select"
              >
                <option value="">Select category</option>
                <option value="split">Split AC</option>
                <option value="window">Window AC</option>
                <option value="central">Central AC</option>
                <option value="portable">Portable AC</option>
                <option value="parts">Spare Parts</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="status">Status *</label>
              <select 
                id="status"
                v-model="currentProduct.status" 
                required
                class="form-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="costPrice">Cost Price</label>
              <input 
                type="number" 
                id="costPrice"
                v-model="currentProduct.costPrice" 
                class="form-input"
                placeholder="Enter cost price"
                step="0.01"
                min="0"
              >
            </div>
            
            <div class="form-group">
              <label for="sellingPrice">Selling Price *</label>
              <input 
                type="number" 
                id="sellingPrice"
                v-model="currentProduct.sellingPrice" 
                required
                class="form-input"
                placeholder="Enter selling price"
                step="0.01"
                min="0"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="stock">Current Stock *</label>
              <input 
                type="number" 
                id="stock"
                v-model="currentProduct.stock" 
                required
                class="form-input"
                placeholder="Enter current stock"
                min="0"
              >
            </div>
            
            <div class="form-group">
              <label for="minStock">Minimum Stock *</label>
              <input 
                type="number" 
                id="minStock"
                v-model="currentProduct.minStock" 
                required
                class="form-input"
                placeholder="Enter minimum stock level"
                min="0"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label for="specifications">Specifications</label>
            <textarea 
              id="specifications"
              v-model="currentProduct.specifications" 
              class="form-textarea"
              placeholder="Enter product specifications (e.g., 1.5 Ton, 5 Star Rating, Inverter Technology)"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              v-model="currentProduct.description" 
              class="form-textarea"
              placeholder="Enter product description"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              {{ isEditing ? 'Update Product' : 'Add Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Stock Update Modal -->
    <div v-if="showStockModal" class="modal-overlay" @click="closeStockModal">
      <div class="modal-content stock-modal" @click.stop>
        <div class="modal-header">
          <h2>Update Stock - {{ stockProduct.name }}</h2>
          <button class="btn-close" @click="closeStockModal">✕</button>
        </div>
        
        <form @submit.prevent="saveStockUpdate" class="stock-form">
          <div class="current-stock-info">
            <div class="info-item">
              <label>Current Stock:</label>
              <span class="value">{{ stockProduct.stock }} units</span>
            </div>
            <div class="info-item">
              <label>Minimum Stock:</label>
              <span class="value">{{ stockProduct.minStock }} units</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="stockAction">Action *</label>
            <select 
              id="stockAction"
              v-model="stockUpdate.action" 
              required
              class="form-select"
            >
              <option value="add">Add Stock</option>
              <option value="remove">Remove Stock</option>
              <option value="set">Set Stock</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="stockQuantity">Quantity *</label>
            <input 
              type="number" 
              id="stockQuantity"
              v-model="stockUpdate.quantity" 
              required
              class="form-input"
              placeholder="Enter quantity"
              min="1"
            >
          </div>
          
          <div class="form-group">
            <label for="stockReason">Reason</label>
            <input 
              type="text" 
              id="stockReason"
              v-model="stockUpdate.reason" 
              class="form-input"
              placeholder="Enter reason for stock update"
            >
          </div>
          
          <div class="new-stock-preview" v-if="stockUpdate.quantity">
            <strong>New Stock: {{ calculateNewStock() }} units</strong>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeStockModal">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Update Stock
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
  name: 'ProductManagement',
  setup() {
    // Sample product data
    const products = ref([
      {
        id: 1,
        name: 'Daikin Split AC 1.5 Ton',
        sku: 'DAI-SP-15T-001',
        brand: 'daikin',
        model: 'FTKP50TV16U',
        category: 'split',
        status: 'active',
        costPrice: 450,
        sellingPrice: 650,
        stock: 25,
        minStock: 5,
        specifications: '1.5 Ton, 5 Star Rating, Inverter Technology, Copper Coil',
        description: 'Energy efficient split AC with advanced inverter technology',
        image: null,
        dateAdded: new Date('2024-01-15')
      },
      {
        id: 2,
        name: 'LG Window AC 1 Ton',
        sku: 'LG-WIN-1T-002',
        brand: 'lg',
        model: 'LWA12GWXA',
        category: 'window',
        status: 'active',
        costPrice: 280,
        sellingPrice: 420,
        stock: 15,
        minStock: 3,
        specifications: '1 Ton, 3 Star Rating, Window Type, Anti-bacterial Filter',
        description: 'Compact window AC perfect for small rooms',
        image: null,
        dateAdded: new Date('2024-01-20')
      },
      {
        id: 3,
        name: 'Samsung Split AC 2 Ton',
        sku: 'SAM-SP-2T-003',
        brand: 'samsung',
        model: 'AR24TV5HLTZNNA',
        category: 'split',
        status: 'active',
        costPrice: 580,
        sellingPrice: 850,
        stock: 8,
        minStock: 2,
        specifications: '2 Ton, 4 Star Rating, Digital Inverter, Triple Protection',
        description: 'High capacity split AC with digital inverter technology',
        image: null,
        dateAdded: new Date('2024-02-01')
      },
      {
        id: 4,
        name: 'Panasonic Portable AC 1.5 Ton',
        sku: 'PAN-POR-15T-004',
        brand: 'panasonic',
        model: 'CW-PC1817YA',
        category: 'portable',
        status: 'active',
        costPrice: 380,
        sellingPrice: 550,
        stock: 12,
        minStock: 4,
        specifications: '1.5 Ton, Portable Design, Remote Control, Timer Function',
        description: 'Portable AC unit with easy installation',
        image: null,
        dateAdded: new Date('2024-02-10')
      },
      {
        id: 5,
        name: 'AC Remote Control Universal',
        sku: 'UNI-REM-001',
        brand: 'universal',
        model: 'REM-UNI-001',
        category: 'parts',
        status: 'active',
        costPrice: 8,
        sellingPrice: 15,
        stock: 50,
        minStock: 10,
        specifications: 'Universal Remote, Compatible with most AC brands',
        description: 'Universal remote control for various AC brands',
        image: null,
        dateAdded: new Date('2024-02-15')
      },
      {
        id: 6,
        name: 'Sharp Split AC 1 Ton',
        sku: 'SHA-SP-1T-005',
        brand: 'sharp',
        model: 'AH-A12SEV',
        category: 'split',
        status: 'inactive',
        costPrice: 320,
        sellingPrice: 480,
        stock: 3,
        minStock: 5,
        specifications: '1 Ton, 3 Star Rating, Plasmacluster Technology',
        description: 'Split AC with Plasmacluster ion technology',
        image: null,
        dateAdded: new Date('2024-02-20')
      },
      {
        id: 7,
        name: 'Mitsubishi Central AC 5 Ton',
        sku: 'MIT-CEN-5T-006',
        brand: 'mitsubishi',
        model: 'PUZ-A60VKA',
        category: 'central',
        status: 'active',
        costPrice: 2200,
        sellingPrice: 3200,
        stock: 2,
        minStock: 1,
        specifications: '5 Ton, VRF System, Multi-zone Control, Energy Efficient',
        description: 'Commercial grade central AC system',
        image: null,
        dateAdded: new Date('2024-02-25')
      },
      {
        id: 8,
        name: 'AC Copper Coil 1.5 Ton',
        sku: 'COP-COIL-15T-007',
        brand: 'universal',
        model: 'CC-15T-001',
        category: 'parts',
        status: 'active',
        costPrice: 45,
        sellingPrice: 75,
        stock: 20,
        minStock: 8,
        specifications: 'Copper Coil, 1.5 Ton Capacity, Anti-corrosion Coating',
        description: 'High quality copper coil for AC units',
        image: null,
        dateAdded: new Date('2024-03-01')
      }
    ])

    // State management
    const searchQuery = ref('')
    const filterCategory = ref('')
    const filterBrand = ref('')
    const sortBy = ref('name')
    const selectedProducts = ref([])
    const selectAll = ref(false)
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    
    // Modal state
    const showModal = ref(false)
    const isEditing = ref(false)
    const currentProduct = reactive({
      id: null,
      name: '',
      sku: '',
      brand: '',
      model: '',
      category: '',
      status: 'active',
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      minStock: 0,
      specifications: '',
      description: '',
      image: null
    })

    // Stock update modal state
    const showStockModal = ref(false)
    const stockProduct = ref({})
    const stockUpdate = reactive({
      action: 'add',
      quantity: 0,
      reason: ''
    })

    // Computed properties
    const filteredProducts = computed(() => {
      let filtered = products.value

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.model.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query)
        )
      }

      // Apply category filter
      if (filterCategory.value) {
        filtered = filtered.filter(product => product.category === filterCategory.value)
      }

      // Apply brand filter
      if (filterBrand.value) {
        filtered = filtered.filter(product => product.brand === filterBrand.value)
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy.value) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'price':
            return a.sellingPrice - b.sellingPrice
          case 'stock':
            return b.stock - a.stock
          case 'created':
            return new Date(b.dateAdded) - new Date(a.dateAdded)
          default:
            return 0
        }
      })

      return filtered
    })

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredProducts.value.slice(start, end)
    })

    const totalProducts = computed(() => products.value.length)
    const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))
    
    const totalStock = computed(() => {
      return products.value.reduce((sum, product) => sum + product.stock, 0)
    })
    
    const lowStockCount = computed(() => {
      return products.value.filter(product => product.stock <= product.minStock).length
    })
    
    const totalValue = computed(() => {
      return products.value.reduce((sum, product) => sum + (product.sellingPrice * product.stock), 0)
    })

    // Utility methods
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatCategory = (category) => {
      const categories = {
        split: 'Split AC',
        window: 'Window AC',
        central: 'Central AC',
        portable: 'Portable AC',
        parts: 'Spare Parts'
      }
      return categories[category] || category
    }

    const formatStatus = (status) => {
      return status.charAt(0).toUpperCase() + status.slice(1)
    }

    const calculateMargin = (product) => {
      if (!product.costPrice) return 0
      return Math.round(((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100)
    }

    const calculateNewStock = () => {
      if (!stockUpdate.quantity) return stockProduct.value.stock
      
      switch (stockUpdate.action) {
        case 'add':
          return stockProduct.value.stock + parseInt(stockUpdate.quantity)
        case 'remove':
          return Math.max(0, stockProduct.value.stock - parseInt(stockUpdate.quantity))
        case 'set':
          return parseInt(stockUpdate.quantity)
        default:
          return stockProduct.value.stock
      }
    }

    // Modal methods
    const openAddModal = () => {
      isEditing.value = false
      resetCurrentProduct()
      showModal.value = true
    }

    const editProduct = (product) => {
      isEditing.value = true
      Object.assign(currentProduct, product)
      showModal.value = true
    }

    const viewProduct = (product) => {
      alert(`Product Details:\n\nName: ${product.name}\nSKU: ${product.sku}\nBrand: ${product.brand}\nModel: ${product.model}\nCategory: ${formatCategory(product.category)}\nStatus: ${formatStatus(product.status)}\nSelling Price: $${product.sellingPrice}\nCost Price: $${product.costPrice || 'N/A'}\nStock: ${product.stock} units\nMin Stock: ${product.minStock} units\nSpecifications: ${product.specifications}\nDescription: ${product.description}`)
    }

    const closeModal = () => {
      showModal.value = false
      resetCurrentProduct()
    }

    const resetCurrentProduct = () => {
      Object.assign(currentProduct, {
        id: null,
        name: '',
        sku: '',
        brand: '',
        model: '',
        category: '',
        status: 'active',
        costPrice: 0,
        sellingPrice: 0,
        stock: 0,
        minStock: 0,
        specifications: '',
        description: '',
        image: null
      })
    }

    const saveProduct = () => {
      if (isEditing.value) {
        // Update existing product
        const index = products.value.findIndex(p => p.id === currentProduct.id)
        if (index !== -1) {
          products.value[index] = { ...currentProduct }
        }
      } else {
        // Add new product
        const newProduct = {
          ...currentProduct,
          id: Date.now(),
          dateAdded: new Date()
        }
        products.value.push(newProduct)
      }
      closeModal()
    }

    const deleteProduct = (id) => {
      if (confirm('Are you sure you want to delete this product?')) {
        products.value = products.value.filter(p => p.id !== id)
        selectedProducts.value = selectedProducts.value.filter(pId => pId !== id)
      }
    }

    // Stock update methods
    const updateStock = (product) => {
      stockProduct.value = { ...product }
      stockUpdate.action = 'add'
      stockUpdate.quantity = 0
      stockUpdate.reason = ''
      showStockModal.value = true
    }

    const closeStockModal = () => {
      showStockModal.value = false
      stockProduct.value = {}
    }

    const saveStockUpdate = () => {
      const index = products.value.findIndex(p => p.id === stockProduct.value.id)
      if (index !== -1) {
        products.value[index].stock = calculateNewStock()
      }
      closeStockModal()
    }

    // Selection methods
    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedProducts.value = paginatedProducts.value.map(p => p.id)
      } else {
        selectedProducts.value = []
      }
    }

    const bulkDelete = () => {
      if (confirm(`Are you sure you want to delete ${selectedProducts.value.length} product(s)?`)) {
        products.value = products.value.filter(p => !selectedProducts.value.includes(p.id))
        selectedProducts.value = []
        selectAll.value = false
      }
    }

    const bulkUpdateStock = () => {
      const selectedData = products.value.filter(p => selectedProducts.value.includes(p.id))
      const stockChange = prompt('Enter stock change (positive to add, negative to remove):')
      if (stockChange !== null) {
        const change = parseInt(stockChange)
        selectedData.forEach(product => {
          const index = products.value.findIndex(p => p.id === product.id)
          if (index !== -1) {
            products.value[index].stock = Math.max(0, product.stock + change)
          }
        })
        selectedProducts.value = []
        selectAll.value = false
      }
    }

    const exportSelected = () => {
      const selectedData = products.value.filter(p => selectedProducts.value.includes(p.id))
      const csvContent = [
        'Name,SKU,Brand,Model,Category,Status,Cost Price,Selling Price,Stock,Min Stock,Specifications,Description',
        ...selectedData.map(p => `"${p.name}","${p.sku}","${p.brand}","${p.model}","${p.category}","${p.status}","${p.costPrice}","${p.sellingPrice}","${p.stock}","${p.minStock}","${p.specifications}","${p.description}"`)
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'products.csv'
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
    watch([searchQuery, filterCategory, filterBrand], () => {
      currentPage.value = 1
    })

    watch(selectedProducts, () => {
      selectAll.value = selectedProducts.value.length === paginatedProducts.value.length && paginatedProducts.value.length > 0
    }, { deep: true })

    return {
      products,
      searchQuery,
      filterCategory,
      filterBrand,
      sortBy,
      selectedProducts,
      selectAll,
      currentPage,
      showModal,
      isEditing,
      currentProduct,
      showStockModal,
      stockProduct,
      stockUpdate,
      filteredProducts,
      paginatedProducts,
      totalProducts,
      totalPages,
      totalStock,
      lowStockCount,
      totalValue,
      formatDate,
      formatCategory,
      formatStatus,
      calculateMargin,
      calculateNewStock,
      openAddModal,
      editProduct,
      viewProduct,
      closeModal,
      saveProduct,
      deleteProduct,
      updateStock,
      closeStockModal,
      saveStockUpdate,
      toggleSelectAll,
      bulkDelete,
      bulkUpdateStock,
      exportSelected,
      previousPage,
      nextPage
    }
  }
}
</script>

<style scoped>
/* Base styles similar to Contact component but with product-specific modifications */
.product-container {
  max-width: 1600px;
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

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th {
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

.product-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}

.product-row {
  transition: background-color 0.2s;
}

.product-row:hover {
  background: #f7fafc;
}

.product-row.selected {
  background: #ebf8ff;
}

.product-row.low-stock {
  background: #fef5e7;
}

/* Table Columns */
.checkbox-column {
  width: 50px;
  text-align: center;
}

.image-column {
  width: 80px;
}

.product-column {
  width: 300px;
}

.price-column {
  width: 150px;
}

.stock-column {
  width: 120px;
}

.category-column {
  width: 120px;
}

.status-column {
  width: 100px;
}

.date-column {
  width: 120px;
}

.actions-column {
  width: 140px;
}

/* Product Image */
.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  color: #a0aec0;
  font-size: 1.5rem;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
  font-size: 1rem;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.85rem;
  color: #718096;
}

.brand {
  font-weight: 500;
  color: #4299e1;
}

.product-specs {
  font-size: 0.8rem;
  color: #a0aec0;
  margin-top: 4px;
  font-style: italic;
}

/* Price Info */
.price-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.selling-price {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
}

.cost-price {
  font-size: 0.85rem;
  color: #718096;
}

.profit-margin {
  font-size: 0.8rem;
  color: #38a169;
  font-weight: 500;
}

/* Stock Info */
.stock-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.current-stock {
  font-weight: 600;
  color: #2d3748;
}

.current-stock.low-stock {
  color: #e53e3e;
}

.min-stock {
  font-size: 0.85rem;
  color: #718096;
}

.stock-status {
  font-size: 0.8rem;
}

.status-good {
  color: #38a169;
}

.status-warning {
  color: #d69e2e;
}

/* Category and Status Badges */
.category-badge,
.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  display: inline-block;
}

.category-split {
  background: #c6f6d5;
  color: #22543d;
}

.category-window {
  background: #bee3f8;
  color: #2a4365;
}

.category-central {
  background: #fbb6ce;
  color: #702459;
}

.category-portable {
  background: #faf089;
  color: #744210;
}

.category-parts {
  background: #e9d8fd;
  color: #553c9a;
}

.status-active {
  background: #c6f6d5;
  color: #22543d;
}

.status-inactive {
  background: #fed7d7;
  color: #c53030;
}

.status-discontinued {
  background: #e2e8f0;
  color: #4a5568;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
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

.btn-stock {
  background: #faf089;
  color: #744210;
}

.btn-stock:hover {
  background: #f6e05e;
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

.btn-warning {
  background: #f6e05e;
  color: #744210;
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

.btn-warning:hover {
  background: #ecc94b;
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.stock-modal {
  max-width: 500px;
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
.product-form,
.stock-form {
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
  margin-bottom: 20px;
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

/* Stock Update Modal */
.current-stock-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 4px;
}

.info-item .value {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
}

.new-stock-preview {
  padding: 12px;
  background: #e6fffa;
  border: 1px solid #81e6d9;
  border-radius: 8px;
  margin-top: 16px;
  text-align: center;
  color: #234e52;
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
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .product-table {
    font-size: 0.85rem;
  }
  
  .product-table th,
  .product-table td {
    padding: 10px 6px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .product-container {
    padding: 10px;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .bulk-actions {
    flex-direction: column;
  }
  
  .current-stock-info {
    grid-template-columns: 1fr;
  }
}
</style>