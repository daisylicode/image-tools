// Theme Toggle Component
class ThemeToggleComponent extends HTMLElement {
    constructor() {
        super();
        this.currentTheme = localStorage.getItem('theme') || 'light';
    }

    connectedCallback() {
        this.createToggleButton();
        this.applyTheme();
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
        button.title = this.currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        
        button.addEventListener('click', () => {
            this.toggleTheme();
        });

        document.body.appendChild(button);
        this.button = button;
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateButton();
    }

    applyTheme() {
        if (this.currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', this.currentTheme);
    }

    updateButton() {
        if (this.button) {
            this.button.innerHTML = this.currentTheme === 'dark' ? '☀️' : '🌙';
            this.button.title = this.currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    }
}

// Auto-detect system preference
function detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Initialize theme when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Use saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = detectSystemTheme();
    const initialTheme = savedTheme || systemTheme;
    
    if (initialTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Create theme toggle component
    const themeToggle = new ThemeToggleComponent();
    themeToggle.currentTheme = initialTheme;
    themeToggle.connectedCallback();
});

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            if (newTheme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
    });
}