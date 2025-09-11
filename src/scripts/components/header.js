// Header Component
class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="container">
                <div class="header-content">
                    <a href="/" class="logo">
                        <img src="/assets/logo.png" alt="Free Image Tools" width="32" height="32">
                        <span>Free Image Tools</span>
                    </a>
                    <button class="mobile-menu-toggle" id="mobileMenuToggle">☰</button>
                    <nav>
                        <ul id="navMenu">
                            <li><a href="/">Home</a></li>
                            <li><a href="/tools/crop">Crop</a></li>
                            <li><a href="/tools/merge">Merge</a></li>
                            <li><a href="/tools/remove-object">Remove Object</a></li>
                            <li><a href="/tools/black-image">Black Image</a></li>
                            <li><a href="/tools/compress">Compress</a></li>
                            <li><a href="/tools/resize">Resize</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    connectedCallback() {
        // Highlight current page
        const currentPath = window.location.pathname;
        const navLinks = this.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.style.color = 'var(--primary-color)';
                link.style.fontWeight = '600';
            }
        });
    }
}

customElements.define('header-component', HeaderComponent);