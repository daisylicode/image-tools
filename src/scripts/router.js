// Simple Router for SPA-like navigation
class Router {
    constructor() {
        this.routes = {};
        this.currentPath = window.location.pathname;
        this.init();
    }

    init() {
        // Handle initial page load
        this.handleRoute(this.currentPath);

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.getAttribute('href')?.startsWith('/')) {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigate(href);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRoute(window.location.pathname);
        });
    }

    navigate(path) {
        if (path !== window.location.pathname) {
            window.history.pushState({}, '', path);
            this.handleRoute(path);
        }
    }

    handleRoute(path) {
        this.currentPath = path;
        
        // Update active navigation
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === path) {
                link.style.color = 'var(--primary-color)';
                link.style.fontWeight = '600';
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        });

        // Close mobile menu
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }
}

// Initialize router
const router = new Router();

export default router;