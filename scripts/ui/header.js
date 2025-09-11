/**
 * Header Component
 * Main navigation header with logo and menu
 */
class Header extends HTMLElement {
  constructor() {
    super()
    this.currentPath = window.location.pathname
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
    this.updateActiveNavigation()
  }

  render() {
    this.innerHTML = `
      <header class="header">
        <div class="header-container">
          <a href="/" class="logo">
            <img src="/assets/logo.svg" alt="Free Image Tools" class="logo-img">
            <span class="logo-text">Free Image Tools</span>
          </a>
          
          <nav class="nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a href="/" class="nav-link" data-page="index">Home</a>
              </li>
              <li class="nav-item">
                <a href="/tools/crop/" class="nav-link" data-page="crop">Crop</a>
              </li>
              <li class="nav-item">
                <a href="/tools/merge/" class="nav-link" data-page="merge">Merge</a>
              </li>
              <li class="nav-item">
                <a href="/tools/remove-object/" class="nav-link" data-page="remove-object">Remove</a>
              </li>
              <li class="nav-item">
                <a href="/tools/black-image/" class="nav-link" data-page="black-image">Black</a>
              </li>
              <li class="nav-item">
                <a href="/tools/compress/" class="nav-link" data-page="compress">Compress</a>
              </li>
              <li class="nav-item">
                <a href="/tools/resize/" class="nav-link" data-page="resize">Resize</a>
              </li>
            </ul>
          </nav>
          
          <div class="header-actions">
            <button class="lang-toggle" id="langToggle" title="Change Language">
              🌐
            </button>
            <button class="mobile-menu-toggle" id="mobileMenuToggle">
              <span class="hamburger"></span>
              <span class="hamburger"></span>
              <span class="hamburger"></span>
            </button>
          </div>
        </div>
      </header>
    `
  }

  setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = this.querySelector('#mobileMenuToggle')
    const navList = this.querySelector('.nav-list')
    
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => {
        navList.classList.toggle('active')
        mobileMenuToggle.classList.toggle('active')
      })
    }

    // Language toggle
    const langToggle = this.querySelector('#langToggle')
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        this.showLanguageSelector()
      })
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        navList.classList.remove('active')
        mobileMenuToggle.classList.remove('active')
      }
    })

    // Handle navigation clicks
    this.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href')
        if (href.startsWith('/')) {
          e.preventDefault()
          this.navigateTo(href)
        }
      })
    })
  }

  updateActiveNavigation() {
    const currentPage = this.getCurrentPage()
    this.querySelectorAll('.nav-link').forEach(link => {
      const page = link.getAttribute('data-page')
      if (page === currentPage) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  }

  getCurrentPage() {
    const path = window.location.pathname
    if (path === '/' || path === '/index.html') return 'index'
    
    const match = path.match(/\/tools\/([^\/]+)/)
    return match ? match[1] : 'index'
  }

  navigateTo(path) {
    // Update URL without page reload
    window.history.pushState({}, '', path)
    this.currentPath = path
    this.updateActiveNavigation()
    
    // Dispatch navigation event
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
  }

  showLanguageSelector() {
    const I18n = window.I18n || (await import('@core/i18n.js')).I18n
    const languages = I18n.getAvailableLanguages()
    const currentLang = I18n.getCurrentLanguage()
    
    const selector = document.createElement('div')
    selector.className = 'language-selector'
    selector.innerHTML = `
      <div class="language-dropdown">
        ${languages.map(lang => `
          <button class="lang-option ${lang.code === currentLang ? 'active' : ''}" 
                  data-lang="${lang.code}">
            ${lang.name}
          </button>
        `).join('')}
      </div>
    `
    
    const langToggle = this.querySelector('#langToggle')
    const rect = langToggle.getBoundingClientRect()
    
    selector.style.position = 'absolute'
    selector.style.top = `${rect.bottom + 5}px`
    selector.style.right = `${window.innerWidth - rect.right}px`
    selector.style.zIndex = '1000'
    
    document.body.appendChild(selector)
    
    // Handle language selection
    selector.querySelectorAll('.lang-option').forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang')
        I18n.setLanguage(lang)
        document.body.removeChild(selector)
      })
    })
    
    // Close when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeSelector(e) {
        if (!selector.contains(e.target)) {
          if (selector.parentNode) {
            document.body.removeChild(selector)
          }
          document.removeEventListener('click', closeSelector)
        }
      })
    }, 100)
  }
}

// Define custom element
customElements.define('app-header', Header)

export default Header