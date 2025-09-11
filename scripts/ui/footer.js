/**
 * Footer Component
 * Site footer with links and information
 */
class Footer extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
    this.setupEventListeners()
  }

  render() {
    this.innerHTML = `
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <div class="footer-section">
              <h3 class="footer-title">Tools</h3>
              <ul class="footer-links">
                <li><a href="/tools/crop/" class="footer-link">Crop Image</a></li>
                <li><a href="/tools/merge/" class="footer-link">Merge Images</a></li>
                <li><a href="/tools/remove-object/" class="footer-link">Remove Object</a></li>
                <li><a href="/tools/black-image/" class="footer-link">Black Image</a></li>
                <li><a href="/tools/compress/" class="footer-link">Compress Image</a></li>
                <li><a href="/tools/resize/" class="footer-link">Resize Image</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">Company</h3>
              <ul class="footer-links">
                <li><a href="/about/" class="footer-link">About Us</a></li>
                <li><a href="/privacy/" class="footer-link">Privacy Policy</a></li>
                <li><a href="/terms/" class="footer-link">Terms of Service</a></li>
                <li><a href="/contact/" class="footer-link">Contact</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">Support</h3>
              <ul class="footer-links">
                <li><a href="/help/" class="footer-link">Help Center</a></li>
                <li><a href="/faq/" class="footer-link">FAQ</a></li>
                <li><a href="/tutorials/" class="footer-link">Tutorials</a></li>
                <li><a href="/feedback/" class="footer-link">Feedback</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">Connect</h3>
              <div class="social-links">
                <a href="https://github.com" target="_blank" rel="noopener" class="social-link" title="GitHub">
                  <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.776-1.648-.579-.386-1.5-.795-1.5-.795-1.226-.845.093-.828.093-.828 1.346.095 2.055 1.382 2.055 1.382 1.193 2.044 3.134 1.456 3.894 1.115.119-.865.467-1.454.85-1.788-2.988-.34-6.127-1.496-6.127-6.656 0-1.47.525-2.674 1.385-3.616-.137-.339-.6-1.707.133-3.558 0 0 1.129-.363 3.697 1.38 1.074-.298 2.225-.447 3.372-.447 1.147 0 2.298.149 3.372.447 2.568-1.743 3.697-1.38 3.697-1.38.733 1.851.27 3.219.133 3.558.86.942 1.385 2.146 1.385 3.616 0 5.177-3.143 6.32-6.144.331.714.497 1.48.497 2.314 0 1.67-.06 3.015-.06 3.425 0 .33.223.715.795.715 4.572 0 7.975-2.965 7.975-6.64 0-1.39-.504-2.656-1.34-3.638 1.193-.368 2.343-1.119 2.343-2.265 0-.497-.177-.92-.467-1.265-.1-.12-.427-.519-1.22-1.08.254-.056.497-.1.727-.13.732-.104 1.393-.23 1.973-.397.58-.167 1.093-.37 1.528-.614.435-.244.785-.528 1.05-.86.265-.33.457-.678.57-1.04.113-.36.17-.732.17-1.104 0-.394-.066-.765-.2-1.115-.133-.35-.352-.66-.65-.92-.3-.26-.678-.45-1.14-.57-.46-.12-.984-.18-1.57-.18-.586 0-1.11.06-1.57.18-.46.12-.84.31-1.14.57-.3.26-.517.57-.65.92-.133.35-.2.72-.2 1.115 0 .372.057.744.17 1.104.113.362.305.71.57 1.04.265.332.615.616 1.05.86.435.244.948.447 1.528.614.58.167 1.24.293 1.973.397.23.03.473.074.727.13.793.56 1.12 1.22 1.08z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener" class="social-link" title="Twitter">
                  <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-1.31 0-2.521-.198-3.55-.566.046.332.07.674.07 1.023 0 3.424-1.868 6.36-4.638 7.897a9.9 9.9 0 01-2.212.299c-.542 0-1.07-.05-1.585-.15a9.963 9.963 0 008.415 4.901c6.732 0 11.585-5.428 11.585-10.14 0-.155 0-.31-.01-.465A8.34 8.34 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="mailto:contact@freeimagetools.online" class="social-link" title="Email">
                  <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            <div class="footer-bottom-content">
              <p class="copyright">
                &copy; 2024 Free Image Tools Online. All rights reserved.
              </p>
              <div class="footer-bottom-links">
                <a href="/privacy/" class="footer-bottom-link">Privacy</a>
                <a href="/terms/" class="footer-bottom-link">Terms</a>
                <a href="/cookies/" class="footer-bottom-link">Cookies</a>
                <a href="/sitemap.xml" class="footer-bottom-link">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `
  }

  setupEventListeners() {
    // Handle link clicks for SPA navigation
    this.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href')
        if (href !== '/sitemap.xml') {
          e.preventDefault()
          this.navigateTo(href)
        }
      })
    })
  }

  navigateTo(path) {
    // Update URL without page reload
    window.history.pushState({}, '', path)
    
    // Dispatch navigation event
    window.dispatchEvent(new CustomEvent('navigate', { detail: { path } }))
    
    // Scroll to top
    window.scrollTo(0, 0)
  }
}

// Define custom element
customElements.define('app-footer', Footer)

export default Footer