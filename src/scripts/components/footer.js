// Footer Component
class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Tools</h3>
                        <ul>
                            <li><a href="/tools/crop">Crop Image</a></li>
                            <li><a href="/tools/merge">Merge Images</a></li>
                            <li><a href="/tools/remove-object">Remove Object</a></li>
                            <li><a href="/tools/black-image">Black Image</a></li>
                            <li><a href="/tools/compress">Compress Image</a></li>
                            <li><a href="/tools/resize">Resize Image</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                            <li><a href="/terms">Terms of Service</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="/help">Help Center</a></li>
                            <li><a href="/faq">FAQ</a></li>
                            <li><a href="/tutorials">Tutorials</a></li>
                            <li><a href="/feedback">Feedback</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Connect</h3>
                        <ul>
                            <li><a href="https://twitter.com" target="_blank">Twitter</a></li>
                            <li><a href="https://github.com" target="_blank">GitHub</a></li>
                            <li><a href="https://facebook.com" target="_blank">Facebook</a></li>
                            <li><a href="mailto:contact@freeimagetools.online">Email</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Free Image Tools Online. All rights reserved. | 
                       <a href="/privacy">Privacy</a> | 
                       <a href="/terms">Terms</a> | 
                       <a href="/cookies">Cookies</a>
                    </p>
                </div>
            </div>
        `;
    }
}

customElements.define('footer-component', FooterComponent);