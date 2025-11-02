// Dark Satoshi Social Media Automation
// Automated content generation and posting system

class SocialAutomation {
    constructor() {
        this.platforms = ['x', 'telegram', 'discord', 'reddit'];
        this.contentQueue = [];
        this.isRunning = false;
        this.postingSchedule = {
            x: { frequency: 2, lastPost: 0 },           // 2 hours
            telegram: { frequency: 4, lastPost: 0 },  // 4 hours
            discord: { frequency: 6, lastPost: 0 },   // 6 hours
            reddit: { frequency: 12, lastPost: 0 }    // 12 hours
        };
        
        this.memeTemplates = [
            "When you buy $DSAT at the bottom 🚀",
            "Dark Satoshi holders be like 💎🙌",
            "Bitcoin vs Dark Satoshi 🤡",
            "When normies ask about crypto 👁️👄👁️",
            "$DSAT price goes up 1%: 'This is the way' 🗿"
        ];
        
        this.newsTemplates = [
            "🚨 Breaking: Dark Satoshi volume hits new ATH!",
            "📈 $DSAT trending on CoinGecko!",
            "🚀 Major partnership announcement coming soon!",
            "💎 New exchange listing confirmed!",
            "🔥 Community reaches 10k holders milestone!"
        ];
        
        this.init();
    }

    init() {
        this.createDashboard();
        this.loadContentHistory();
        this.startAutomation();
    }

    // Create social media dashboard
    createDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'social-dashboard';
        dashboard.className = 'fixed top-20 left-4 bg-gray-900 border border-cyan-400 rounded-lg p-4 z-40 max-w-md';
        dashboard.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-cyan-400">Social Automation</h3>
                <button id="toggle-dashboard" class="text-gray-400 hover:text-white">−</button>
            </div>
            
            <div id="dashboard-content">
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-300">Status</span>
                        <div id="automation-status" class="text-red-400 font-medium">Stopped</div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2">
                        <button id="start-automation" class="btn-primary text-sm py-2">Start</button>
                        <button id="stop-automation" class="btn-secondary text-sm py-2" disabled>Stop</button>
                    </div>
                    
                    <div class="border-t border-gray-700 pt-3">
                        <h4 class="text-sm font-medium text-gray-300 mb-2">Platforms</h4>
                        <div class="space-y-2">
                            ${this.platforms.map(platform => `
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-400 capitalize">${platform === 'x' ? 'X (Twitter)' : platform}</span>
                                    <div class="flex items-center space-x-2">
                                        <span id="${platform}-status" class="text-xs text-red-400">●</span>
                                        <span id="${platform}-next" class="text-xs text-gray-500">--</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-700 pt-3">
                        <h4 class="text-sm font-medium text-gray-300 mb-2">Quick Actions</h4>
                        <div class="grid grid-cols-2 gap-2">
                            <button id="generate-meme" class="btn-secondary text-xs py-1">Generate Meme</button>
                            <button id="post-announcement" class="btn-secondary text-xs py-1">Announcement</button>
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-700 pt-3">
                        <h4 class="text-sm font-medium text-gray-300 mb-2">Recent Posts</h4>
                        <div id="recent-posts" class="space-y-1 max-h-32 overflow-y-auto">
                            <div class="text-xs text-gray-500 text-center">No posts yet</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dashboard);
        this.setupDashboardEvents();
    }

    // Setup dashboard event listeners
    setupDashboardEvents() {
        const toggleBtn = document.getElementById('toggle-dashboard');
        const startBtn = document.getElementById('start-automation');
        const stopBtn = document.getElementById('stop-automation');
        const generateMemeBtn = document.getElementById('generate-meme');
        const postAnnouncementBtn = document.getElementById('post-announcement');

        toggleBtn.addEventListener('click', () => {
            const content = document.getElementById('dashboard-content');
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? '−' : '+';
        });

        startBtn.addEventListener('click', () => this.startAutomation());
        stopBtn.addEventListener('click', () => this.stopAutomation());
        generateMemeBtn.addEventListener('click', () => this.generateAndPostMeme());
        postAnnouncementBtn.addEventListener('click', () => this.postAnnouncement());
    }

    // Start automation
    startAutomation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        const statusElement = document.getElementById('automation-status');
        const startBtn = document.getElementById('start-automation');
        const stopBtn = document.getElementById('stop-automation');
        
        statusElement.textContent = 'Running';
        statusElement.className = 'text-green-400 font-medium';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        this.automationInterval = setInterval(() => {
            this.checkAndPost();
        }, 60000); // Check every minute
        
        this.updatePlatformStatuses();
        console.log('Social automation started');
    }

    // Stop automation
    stopAutomation() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        
        const statusElement = document.getElementById('automation-status');
        const startBtn = document.getElementById('start-automation');
        const stopBtn = document.getElementById('stop-automation');
        
        statusElement.textContent = 'Stopped';
        statusElement.className = 'text-red-400 font-medium';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        if (this.automationInterval) {
            clearInterval(this.automationInterval);
        }
        
        console.log('Social automation stopped');
    }

    // Check if it's time to post on any platform
    checkAndPost() {
        const now = Date.now();
        
        Object.keys(this.postingSchedule).forEach(platform => {
            const schedule = this.postingSchedule[platform];
            const hoursSinceLastPost = (now - schedule.lastPost) / (1000 * 60 * 60);
            
            if (hoursSinceLastPost >= schedule.frequency) {
                this.postToPlatform(platform);
                schedule.lastPost = now;
            }
        });
        
        this.updatePlatformStatuses();
    }

    // Post to specific platform
    async postToPlatform(platform) {
        const content = this.generateContent(platform);
        const post = {
            id: Date.now() + Math.random(),
            platform: platform,
            content: content,
            timestamp: Date.now(),
            status: 'pending'
        };
        
        this.contentQueue.push(post);
        
        try {
            // Simulate API call
            await this.simulateApiCall(platform, content);
            post.status = 'posted';
            this.addToRecentPosts(post);
            console.log(`Posted to ${platform}:`, content);
        } catch (error) {
            post.status = 'failed';
            console.error(`Failed to post to ${platform}:`, error);
        }
    }

    // Generate content based on platform
    generateContent(platform) {
        const templates = this.getPlatformTemplates(platform);
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        return this.fillTemplate(template, platform);
    }

    // Get platform-specific templates
    getPlatformTemplates(platform) {
        switch (platform) {
            case 'x':
                return [
                    ...this.memeTemplates,
                    ...this.newsTemplates,
                    "$DSAT to the moon! 🚀🌙",
                    "Who else is buying the dip? 👀",
                    "Dark Satoshi > Your favorite coin 🤷‍♂️"
                ];
            case 'telegram':
                return [
                    ...this.memeTemplates,
                    "Community discussion: What's your price prediction for $DSAT?",
                    "Share your $DSAT gains in the comments! 💰",
                    "Welcome to all new members! 🎉"
                ];
            case 'discord':
                return [
                    "Gaming session starting in 30 minutes! 🎮",
                    "Voice chat party tonight! Who's in? 🎤",
                    "Share your best $DSAT memes! 😂"
                ];
            case 'reddit':
                return [
                    "Why Dark Satoshi is the future of meme coins (DD)",
                    "Technical analysis: $DSAT price prediction",
                    "Community milestone celebration post"
                ];
            default:
                return this.memeTemplates;
        }
    }

    // Fill template with dynamic content
    fillTemplate(template, platform) {
        const price = window.darkSatoshi ? window.darkSatoshi.currentPrice : 0.001337;
        const holders = 13337 + Math.floor(Math.random() * 100);
        const volume = (666000 + Math.floor(Math.random() * 100000)) / 1000;
        
        return template
            .replace('{price}', `$${price.toFixed(6)}`)
            .replace('{holders}', holders.toLocaleString())
            .replace('{volume}', `$${volume}K`)
            .replace('{gain}', `${(Math.random() * 20 + 5).toFixed(1)}%`)
            .replace('{emoji}', this.getRandomEmoji());
    }

    // Get random emoji
    getRandomEmoji() {
        const emojis = ['🚀', '🌙', '💎', '🙌', '🤡', '👀', '🗿', '🔥', '💰', '🎉'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    // Simulate API call
    simulateApiCall(platform, content) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 95% success rate
                if (Math.random() < 0.95) {
                    resolve({ success: true, postId: Date.now() });
                } else {
                    reject(new Error('API rate limit exceeded'));
                }
            }, 1000 + Math.random() * 2000);
        });
    }

    // Generate and post meme
    generateAndPostMeme() {
        const template = this.memeTemplates[Math.floor(Math.random() * this.memeTemplates.length)];
        const content = this.fillTemplate(template, 'x');
        
        this.postToPlatform('x');
        this.showNotification('Meme generated and queued for posting!', 'success');
    }

    // Post announcement
    postAnnouncement() {
        const template = this.newsTemplates[Math.floor(Math.random() * this.newsTemplates.length)];
        
        // Post to all platforms
        this.platforms.forEach(platform => {
            setTimeout(() => {
                this.postToPlatform(platform);
            }, Math.random() * 5000);
        });
        
        this.showNotification('Announcement posted to all platforms!', 'success');
    }

    // Update platform status displays
    updatePlatformStatuses() {
        const now = Date.now();
        
        Object.keys(this.postingSchedule).forEach(platform => {
            const schedule = this.postingSchedule[platform];
            const hoursSinceLastPost = (now - schedule.lastPost) / (1000 * 60 * 60);
            const hoursUntilNext = Math.max(0, schedule.frequency - hoursSinceLastPost);
            
            const statusElement = document.getElementById(`${platform}-status`);
            const nextElement = document.getElementById(`${platform}-next`);
            
            if (statusElement) {
                statusElement.className = hoursSinceLastPost < schedule.frequency ? 
                    'text-xs text-green-400' : 'text-xs text-red-400';
                statusElement.textContent = hoursSinceLastPost < schedule.frequency ? '●' : '○';
            }
            
            if (nextElement) {
                nextElement.textContent = hoursUntilNext > 1 ?
                    `${hoursUntilNext.toFixed(1)}h` : `${(hoursUntilNext * 60).toFixed(0)}m`;
            }
        });
    }

    // Add post to recent posts display
    addToRecentPosts(post) {
        const container = document.getElementById('recent-posts');
        if (!container) return;
        
        const postElement = document.createElement('div');
        postElement.className = 'text-xs text-gray-400 p-1 bg-gray-800 rounded';
        postElement.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="capitalize">${post.platform}</span>
                <span>${new Date(post.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="truncate">${post.content.substring(0, 30)}...</div>
        `;
        
        container.insertBefore(postElement, container.firstChild);
        
        // Keep only last 5 posts
        while (container.children.length > 5) {
            container.removeChild(container.lastChild);
        }
        
        // Remove "no posts" message
        const noPostsMsg = container.querySelector('.text-center');
        if (noPostsMsg) {
            container.removeChild(noPostsMsg);
        }
    }

    // Load content history
    loadContentHistory() {
        const saved = localStorage.getItem('darkSatoshiContentHistory');
        if (saved) {
            this.contentQueue = JSON.parse(saved);
        }
    }

    // Save content history
    saveContentHistory() {
        localStorage.setItem('darkSatoshiContentHistory', JSON.stringify(this.contentQueue));
    }

    // Show notification
    showNotification(message, type = 'info') {
        if (window.darkSatoshi && window.darkSatoshi.showNotification) {
            window.darkSatoshi.showNotification(message, type);
        }
    }

    // Get analytics
    getAnalytics() {
        const now = Date.now();
        const last24h = this.contentQueue.filter(post => 
            (now - post.timestamp) < (24 * 60 * 60 * 1000)
        );
        
        return {
            totalPosts: this.contentQueue.length,
            posts24h: last24h.length,
            platforms: this.platforms.reduce((acc, platform) => {
                acc[platform] = this.contentQueue.filter(post => post.platform === platform).length;
                return acc;
            }, {}),
            successRate: this.contentQueue.filter(post => post.status === 'posted').length / this.contentQueue.length * 100
        };
    }
}

// Content templates for different scenarios
const ContentTemplates = {
    bullish: [
        "🚀 $DSAT breaking resistance! Next target: $0.01",
        "💎 Hands getting rewarded! Price up {gain} today!",
        "Dark Satoshi community growing faster than ever!"
    ],
    
    bearish: [
        "📉 Buying opportunity? $DSAT on sale!",
        "💪 Strong hands accumulate during dips",
        "Patience pays in crypto 🧘‍♂️"
    ],
    
    neutral: [
        "🤔 What's your $DSAT price prediction for next week?",
        "💭 Share your crypto journey with us!",
        "🎲 Random $DSAT giveaway in comments!"
    ],
    
    milestones: [
        "🎉 {holders} holders strong! Thank you community!",
        "📊 {volume} volume today! Incredible growth!",
        "🏆 New all-time high! We did it!"
    ]
};

// Initialize social automation
let socialAutomation;
document.addEventListener('DOMContentLoaded', () => {
    // Initialize social automation on all environments
    socialAutomation = new SocialAutomation();
    
    // Add keyboard shortcut to toggle social panel (Ctrl+Shift+S)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            const panel = document.getElementById('social-dashboard');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            } else if (socialAutomation) {
                socialAutomation.createDashboard();
            }
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SocialAutomation, ContentTemplates };
}
