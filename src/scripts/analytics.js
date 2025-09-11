// Analytics - Placeholder for future implementation
class Analytics {
    constructor() {
        this.enabled = false;
        this.events = [];
        this.init();
    }

    init() {
        // Check if analytics is enabled (from localStorage or config)
        this.enabled = localStorage.getItem('analyticsEnabled') !== 'false';
        
        if (this.enabled) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Track page views
        this.trackPageView();

        // Track tool usage
        this.trackToolUsage();

        // Track user interactions
        this.trackInteractions();
    }

    trackPageView() {
        const path = window.location.pathname;
        const title = document.title;
        
        this.logEvent('page_view', {
            path,
            title,
            timestamp: Date.now(),
            referrer: document.referrer
        });
    }

    trackToolUsage() {
        // Track when tools are used
        document.addEventListener('tool_used', (e) => {
            this.logEvent('tool_used', {
                tool: e.detail.tool,
                action: e.detail.action,
                timestamp: Date.now()
            });
        });
    }

    trackInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button) {
                this.logEvent('button_click', {
                    button_text: button.textContent,
                    button_class: button.className,
                    timestamp: Date.now()
                });
            }
        });

        // Track file uploads
        document.addEventListener('file_upload', (e) => {
            this.logEvent('file_upload', {
                file_size: e.detail.fileSize,
                file_type: e.detail.fileType,
                timestamp: Date.now()
            });
        });

        // Track downloads
        document.addEventListener('file_download', (e) => {
            this.logEvent('file_download', {
                file_size: e.detail.fileSize,
                file_type: e.detail.fileType,
                tool: e.detail.tool,
                timestamp: Date.now()
            });
        });
    }

    logEvent(eventName, data) {
        const event = {
            event: eventName,
            data: data,
            timestamp: Date.now(),
            user_id: this.getUserId(),
            session_id: this.getSessionId()
        };

        this.events.push(event);

        // Keep only last 100 events in memory
        if (this.events.length > 100) {
            this.events = this.events.slice(-100);
        }

        // In a real implementation, you would send this to your analytics service
        console.log('Analytics Event:', event);

        // Store events for later processing
        this.storeEvents();
    }

    getUserId() {
        let userId = localStorage.getItem('user_id');
        if (!userId) {
            userId = this.generateId();
            localStorage.setItem('user_id', userId);
        }
        return userId;
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem('session_id', sessionId);
        }
        return sessionId;
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    storeEvents() {
        try {
            const eventsToStore = this.events.slice(-10); // Store last 10 events
            localStorage.setItem('analytics_events', JSON.stringify(eventsToStore));
        } catch (error) {
            console.warn('Failed to store analytics events:', error);
        }
    }

    getStoredEvents() {
        try {
            const stored = localStorage.getItem('analytics_events');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Failed to retrieve analytics events:', error);
            return [];
        }
    }

    clearEvents() {
        this.events = [];
        localStorage.removeItem('analytics_events');
    }

    exportEvents() {
        return {
            events: this.events,
            stored_events: this.getStoredEvents(),
            export_time: Date.now()
        };
    }

    enable() {
        this.enabled = true;
        localStorage.setItem('analyticsEnabled', 'true');
        this.setupEventListeners();
    }

    disable() {
        this.enabled = false;
        localStorage.setItem('analyticsEnabled', 'false');
        this.clearEvents();
    }
}

// Initialize analytics
const analytics = new Analytics();

// Make it available globally for event dispatching
window.analytics = analytics;

// Helper functions for common events
function trackToolUsage(tool, action) {
    if (window.analytics && window.analytics.enabled) {
        const event = new CustomEvent('tool_used', {
            detail: { tool, action }
        });
        document.dispatchEvent(event);
    }
}

function trackFileUpload(file) {
    if (window.analytics && window.analytics.enabled) {
        const event = new CustomEvent('file_upload', {
            detail: {
                fileSize: file.size,
                fileType: file.type
            }
        });
        document.dispatchEvent(event);
    }
}

function trackFileDownload(file, tool) {
    if (window.analytics && window.analytics.enabled) {
        const event = new CustomEvent('file_download', {
            detail: {
                fileSize: file.size,
                fileType: file.type,
                tool: tool
            }
        });
        document.dispatchEvent(event);
    }
}

export { analytics, trackToolUsage, trackFileUpload, trackFileDownload };