// Dark Satoshi - Main JavaScript File
// Comprehensive functionality for trading, animations, and interactions

class DarkSatoshi {
    constructor() {
        this.walletConnected = false;
        this.currentPrice = 0.001337;
        this.chart = null;
        this.priceHistory = this.generatePriceHistory();
        this.init();
    }

    init() {
        this.setupVantaBackground();
        this.setupScrollAnimations();
        this.setupPriceChart();
        this.setupTradingInterface();
        this.setupMobileMenu();
        this.startPriceUpdates();
        this.loadWalletState();
    }

    // Vanta.js Background Setup
    setupVantaBackground() {
        if (typeof VANTA !== 'undefined') {
            VANTA.BIRDS({
                el: "#vanta-bg",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                backgroundColor: 0x0a0a0a,
                color1: 0x00ff41,
                color2: 0x00ffff,
                birdSize: 1.5,
                wingSpan: 25.00,
                speedLimit: 4.00,
                separation: 20.00,
                alignment: 20.00,
                cohesion: 20.00,
                quantity: 3.00
            });
        }
    }

    // Scroll Animations with GSAP
    setupScrollAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Reveal animations
            gsap.utils.toArray('.reveal').forEach(element => {
                gsap.fromTo(element, {
                    opacity: 0,
                    y: 50
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    }
                });
            });

            // Parallax effect for hero
            gsap.to('.hero-bg', {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }

    // Generate realistic price history
    generatePriceHistory() {
        const history = [];
        const now = Date.now();
        let price = this.currentPrice;
        
        for (let i = 30; i >= 0; i--) {
            const timestamp = now - (i * 24 * 60 * 60 * 1000);
            price = price * (1 + (Math.random() - 0.5) * 0.2);
            history.push({
                time: new Date(timestamp).toISOString().split('T')[0],
                price: Math.max(price, 0.0001)
            });
        }
        
        return history;
    }

    // Setup price chart with Chart.js
    setupPriceChart() {
        const ctx = document.getElementById('priceChart');
        if (!ctx) return;

        const chartData = {
            labels: this.priceHistory.map(item => item.time),
            datasets: [{
                label: '$DSAT Price',
                data: this.priceHistory.map(item => item.price),
                borderColor: '#00ff41',
                backgroundColor: 'rgba(0, 255, 65, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00ff41',
                pointBorderColor: '#000',
                pointRadius: 0,
                pointHoverRadius: 6
            }]
        };

        const config = {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        titleColor: '#00ff41',
                        bodyColor: '#ffffff',
                        borderColor: '#00ff41',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return 'Price: $' + context.parsed.y.toFixed(6);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b0b0b0'
                        }
                    },
                    y: {
                        display: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#b0b0b0',
                            callback: function(value) {
                                return '$' + value.toFixed(6);
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };

        if (typeof Chart !== 'undefined') {
            this.chart = new Chart(ctx, config);
        }
    }

    // Trading interface setup
    setupTradingInterface() {
        const amountInput = document.getElementById('trade-amount');
        const receiveInput = document.getElementById('receive-amount');
        
        if (amountInput) {
            amountInput.addEventListener('input', (e) => {
                const amount = parseFloat(e.target.value) || 0;
                const receiveAmount = amount / this.currentPrice;
                receiveInput.value = receiveAmount.toFixed(0);
            });
        }
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const nav = document.querySelector('.navbar .container');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                // Create mobile menu if it doesn't exist
                let mobileMenu = document.getElementById('mobile-menu');
                if (!mobileMenu) {
                    mobileMenu = document.createElement('div');
                    mobileMenu.id = 'mobile-menu';
                    mobileMenu.className = 'absolute top-full left-0 w-full bg-black bg-opacity-95 p-4 mt-2';
                    mobileMenu.innerHTML = `
                        <div class="flex flex-col space-y-2">
                            <a href="#home" class="nav-link block">Home</a>
                            <a href="#trade" class="nav-link block">Trade</a>
                            <a href="#tokenomics" class="nav-link block">Tokenomics</a>
                            <a href="#roadmap" class="nav-link block">Roadmap</a>
                            <a href="#community" class="nav-link block">Community</a>
                        </div>
                    `;
                    nav.appendChild(mobileMenu);
                }
                
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    // Start price updates simulation
    startPriceUpdates() {
        setInterval(() => {
            // Simulate price movement
            const change = (Math.random() - 0.5) * 0.02;
            this.currentPrice = Math.max(this.currentPrice * (1 + change), 0.0001);
            
            // Update price display
            const priceElement = document.getElementById('price');
            if (priceElement) {
                priceElement.textContent = '$' + this.currentPrice.toFixed(6);
                priceElement.className = change > 0 ? 'text-2xl font-bold text-green-400' : 'text-2xl font-bold text-red-400';
            }
            
            // Update other stats
            this.updateStats();
            
            // Update chart if it exists
            if (this.chart) {
                const newDataPoint = {
                    time: new Date().toISOString().split('T')[1].substring(0, 5),
                    price: this.currentPrice
                };
                
                // Add new point and remove old ones if too many
                this.chart.data.labels.push(newDataPoint.time);
                this.chart.data.datasets[0].data.push(newDataPoint.price);
                
                if (this.chart.data.labels.length > 50) {
                    this.chart.data.labels.shift();
                    this.chart.data.datasets[0].data.shift();
                }
                
                this.chart.update('none');
            }
        }, 3000);
    }

    // Update market statistics
    updateStats() {
        const marketCap = this.currentPrice * 1000000000; // Total supply
        const holders = 13337 + Math.floor(Math.random() * 10);
        const volume = 666000 + Math.floor(Math.random() * 50000);
        
        const marketCapElement = document.getElementById('market-cap');
        const holdersElement = document.getElementById('holders');
        const volumeElement = document.getElementById('volume');
        
        if (marketCapElement) {
            marketCapElement.textContent = '$' + (marketCap / 1000000).toFixed(1) + 'M';
        }
        if (holdersElement) {
            holdersElement.textContent = holders.toLocaleString();
        }
        if (volumeElement) {
            volumeElement.textContent = '$' + (volume / 1000).toFixed(0) + 'K';
        }
    }

    // Wallet connection simulation
    async connectWallet() {
        try {
            const connectBtn = document.getElementById('connect-wallet');
            const walletStatus = document.getElementById('wallet-status');
            
            // Show loading state
            connectBtn.innerHTML = '<div class="loading-spinner mx-auto"></div>';
            connectBtn.disabled = true;
            
            // Simulate connection delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock successful connection
            this.walletConnected = true;
            walletStatus.textContent = 'Connected';
            walletStatus.className = 'text-green-400';
            
            connectBtn.textContent = 'Wallet Connected';
            connectBtn.className = 'btn-secondary w-full';
            
            // Save to localStorage
            localStorage.setItem('darkSatoshiWallet', 'connected');
            
            this.showNotification('Wallet connected successfully!', 'success');
            
        } catch (error) {
            this.showNotification('Failed to connect wallet', 'error');
            this.resetConnectButton();
        }
    }

    // Load wallet state from localStorage
    loadWalletState() {
        const saved = localStorage.getItem('darkSatoshiWallet');
        if (saved === 'connected') {
            this.walletConnected = true;
            const walletStatus = document.getElementById('wallet-status');
            const connectBtn = document.getElementById('connect-wallet');
            
            if (walletStatus) {
                walletStatus.textContent = 'Connected';
                walletStatus.className = 'text-green-400';
            }
            
            if (connectBtn) {
                connectBtn.textContent = 'Wallet Connected';
                connectBtn.className = 'btn-secondary w-full';
            }
        }
    }

    // Reset connect button
    resetConnectButton() {
        const connectBtn = document.getElementById('connect-wallet');
        if (connectBtn) {
            connectBtn.textContent = 'Connect Solana Wallet';
            connectBtn.className = 'btn-primary w-full';
            connectBtn.disabled = false;
        }
    }

    // Execute trade simulation
    executeTrade(type) {
        if (!this.walletConnected) {
            this.showNotification('Please connect your wallet first', 'error');
            return;
        }
        
        const amountInput = document.getElementById('trade-amount');
        const amount = parseFloat(amountInput.value);
        
        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }
        
        // Simulate trade execution
        this.showNotification(`${type.toUpperCase()} order executed successfully!`, 'success');
        
        // Add visual feedback
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }

    // Airdrop claim simulation
    claimAirdrop() {
        if (!this.walletConnected) {
            this.showNotification('Please connect your wallet first', 'error');
            return;
        }
        
        // Simulate airdrop claim
        this.showNotification('Airdrop claimed! 1337 $DSAT tokens added to your wallet', 'success');
        
        // Add to claimed list
        localStorage.setItem('darkSatoshiAirdrop', 'claimed');
    }

    // Share referral
    shareReferral() {
        const referralLink = `https://darksatoshi.com?ref=${Math.random().toString(36).substr(2, 9)}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Join Dark Satoshi',
                text: 'Get free $DSAT tokens and join the shadow revolution!',
                url: referralLink
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(referralLink).then(() => {
                this.showNotification('Referral link copied to clipboard!', 'success');
            });
        }
    }

    // Open social media
    openSocial(platform) {
        const links = {
            x: 'https://x.com/dark_satoshi_',
            telegram: 'https://t.me/darksatoshiofficial',
            discord: 'https://discord.gg/VaE2CSue',
            youtube: 'https://youtube.com/@darksatoshi'
        };
        
        // Open the actual social media link
        window.open(links[platform], '_blank');
        
        // Show notification
        this.showNotification(`Opening ${platform}...`, 'info');
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
        
        // Set colors based on type
        const colors = {
            success: 'bg-green-600 text-white',
            error: 'bg-red-600 text-white',
            info: 'bg-blue-600 text-white',
            warning: 'bg-yellow-600 text-black'
        };
        
        notification.className += ` ${colors[type]}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Copy contract address to clipboard
function copyContract() {
    const contractElement = document.getElementById('contract-address');
    if (contractElement) {
        const contractText = contractElement.textContent;
        
        // Don't copy if it's still "Coming Soon..."
        if (contractText === 'Coming Soon...') {
            if (window.darkSatoshi) {
                window.darkSatoshi.showNotification('Contract address not available yet!', 'warning');
            }
            return;
        }
        
        // Copy to clipboard
        navigator.clipboard.writeText(contractText).then(() => {
            if (window.darkSatoshi) {
                window.darkSatoshi.showNotification('Contract address copied!', 'success');
            }
            
            // Visual feedback on button
            const copyBtn = document.getElementById('copy-ca');
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            }
        }).catch(() => {
            if (window.darkSatoshi) {
                window.darkSatoshi.showNotification('Failed to copy address', 'error');
            }
        });
    }
}

// Update contract address (call this when you have the real contract)
function updateContractAddress(address) {
    const contractElement = document.getElementById('contract-address');
    const copyBtn = document.getElementById('copy-ca');
    
    if (contractElement && address) {
        contractElement.textContent = address;
        contractElement.style.fontSize = '0.9rem'; // Smaller font for real address
        
        // Show copy button when real address is available
        if (copyBtn) {
            copyBtn.style.display = 'inline-block';
        }
        
        // Save to localStorage
        localStorage.setItem('darkSatoshiContract', address);
    }
}

// Load contract address from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedContract = localStorage.getItem('darkSatoshiContract');
    if (savedContract) {
        updateContractAddress(savedContract);
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.darkSatoshi = new DarkSatoshi();
});

// Global functions for HTML onclick handlers
function openSocial(platform) {
    if (window.darkSatoshi) {
        window.darkSatoshi.openSocial(platform);
    }
}

function connectWallet() {
    if (window.darkSatoshi) {
        window.darkSatoshi.connectWallet();
    }
}

function executeTrade(type) {
    if (window.darkSatoshi) {
        window.darkSatoshi.executeTrade(type);
    }
}

function claimAirdrop() {
    if (window.darkSatoshi) {
        window.darkSatoshi.claimAirdrop();
    }
}

function shareReferral() {
    if (window.darkSatoshi) {
        window.darkSatoshi.shareReferral();
    }
}

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.darkSatoshi && document.hidden) {
        // Pause animations when page is hidden
    } else if (window.darkSatoshi && !document.hidden) {
        // Resume animations when page is visible
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkSatoshi;
}
