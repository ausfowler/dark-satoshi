// Dark Satoshi Market Making Automation
// Advanced tools for volume generation and market manipulation

class MarketMaker {
    constructor() {
        this.isRunning = false;
        this.trades = [];
        this.wallets = [
            { address: 'DSAT_WALLET_1', balance: 2500, usageWeight: 0.35 },
            { address: 'DSAT_WALLET_2', balance: 2500, usageWeight: 0.25 },
            { address: 'DSAT_WALLET_3', balance: 2500, usageWeight: 0.25 },
            { address: 'DSAT_WALLET_4', balance: 2500, usageWeight: 0.15 }
        ];
        this.currentWalletIndex = 0;
        this.volumeTarget = 100000; // Target daily volume in USD
        this.tradeFrequency = 5000; // Trade every 5 seconds
        this.priceStability = 0.02; // 2% max price swing
        this.init();
    }

    init() {
        this.setupWebSocket();
        this.loadSettings();
        this.createControlPanel();
    }

    // Setup WebSocket for real-time data
    setupWebSocket() {
        // Mock WebSocket connection for demo
        this.ws = {
            send: (data) => console.log('WS Send:', data),
            onmessage: (callback) => this.wsCallback = callback
        };
    }

    // Load saved settings
    loadSettings() {
        const saved = localStorage.getItem('marketMakerSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            this.volumeTarget = settings.volumeTarget || this.volumeTarget;
            this.tradeFrequency = settings.tradeFrequency || this.tradeFrequency;
            this.priceStability = settings.priceStability || this.priceStability;
        }
    }

    // Save settings
    saveSettings() {
        const settings = {
            volumeTarget: this.volumeTarget,
            tradeFrequency: this.tradeFrequency,
            priceStability: this.priceStability,
            isRunning: this.isRunning
        };
        localStorage.setItem('marketMakerSettings', JSON.stringify(settings));
    }

    // Create control panel UI
    createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'market-maker-panel';
        panel.className = 'fixed bottom-4 right-4 bg-gray-900 border border-green-400 rounded-lg p-4 z-50 max-w-sm';
        
        // Create dashboard content using DOM methods to avoid CSP issues
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-4';
        header.innerHTML = `
            <h3 class="text-lg font-bold text-green-400">Market Maker</h3>
            <button id="toggle-panel" class="text-gray-400 hover:text-white">−</button>
        `;
        
        const content = document.createElement('div');
        content.id = 'panel-content';
        content.innerHTML = `
            <div class="space-y-3">
                <div>
                    <label class="block text-sm text-gray-300 mb-1">Status</label>
                    <div id="bot-status" class="text-red-400 font-medium">Stopped</div>
                </div>
                
                <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-300">Wallet Network</span>
                    <span class="text-green-400 font-medium">4 Wallets Active</span>
                </div>
                
                <div class="border-t border-gray-700 pt-2">
                    <label class="block text-xs text-gray-400 mb-1">Wallet Distribution</label>
                    <div class="space-y-1 text-xs">
                        <div class="flex justify-between">
                            <span>Wallet 1 (35%)</span>
                            <span class="text-green-400">$2,500</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Wallet 2 (25%)</span>
                            <span class="text-cyan-400">$2,500</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Wallet 3 (25%)</span>
                            <span class="text-yellow-400">$2,500</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Wallet 4 (15%)</span>
                            <span class="text-purple-400">$2,500</span>
                        </div>
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm text-gray-300 mb-1">Volume Target (USD)</label>
                    <input type="number" id="volume-target" value="100000" 
                           class="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm">
                </div>
                
                <div>
                    <label class="block text-sm text-gray-300 mb-1">Trade Frequency (ms)</label>
                    <input type="number" id="trade-frequency" value="5000" 
                           class="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm">
                </div>
                
                <div>
                    <label class="block text-sm text-gray-300 mb-1">Price Stability (%)</label>
                    <input type="number" id="price-stability" value="2.0" step="0.1"
                           class="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm">
                </div>
                
                <div class="flex gap-2">
                    <button id="start-bot" class="btn-primary flex-1 text-sm py-2">Start</button>
                    <button id="stop-bot" class="btn-secondary flex-1 text-sm py-2" disabled>Stop</button>
                </div>
                
                <div class="text-xs text-gray-400">
                    <div>Today's Volume: <span id="daily-volume" class="text-green-400">$0</span></div>
                    <div>Total Trades: <span id="total-trades" class="text-cyan-400">0</span></div>
                    <div>Avg Trade Size: <span id="avg-trade" class="text-yellow-400">$0</span></div>
                    <div>Active Wallets: <span class="text-purple-400">4/4</span></div>
                </div>
            </div>
        `;
        
        panel.appendChild(header);
        panel.appendChild(content);
        document.body.appendChild(panel);
        this.setupPanelEvents();
        
        // Set up input event listeners for CSP compliance
        this.setupInputListeners();
    }
    
    // Set up input listeners for CSP compliance
    setupInputListeners() {
        const volumeInput = document.getElementById('volume-target');
        const frequencyInput = document.getElementById('trade-frequency');
        const stabilityInput = document.getElementById('price-stability');
        
        if (volumeInput) {
            volumeInput.addEventListener('change', () => {
                this.volumeTarget = parseFloat(volumeInput.value) || 100000;
            });
        }
        
        if (frequencyInput) {
            frequencyInput.addEventListener('change', () => {
                this.tradeFrequency = parseInt(frequencyInput.value) || 5000;
            });
        }
        
        if (stabilityInput) {
            stabilityInput.addEventListener('change', () => {
                this.priceStability = (parseFloat(stabilityInput.value) || 2.0) / 100;
            });
        }
    }

    // Setup panel event listeners
    setupPanelEvents() {
        const toggleBtn = document.getElementById('toggle-panel');
        const startBtn = document.getElementById('start-bot');
        const stopBtn = document.getElementById('stop-bot');
        const volumeInput = document.getElementById('volume-target');
        const frequencyInput = document.getElementById('trade-frequency');
        const stabilityInput = document.getElementById('price-stability');

        toggleBtn.addEventListener('click', () => {
            const content = document.getElementById('panel-content');
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleBtn.textContent = isHidden ? '−' : '+';
        });

        startBtn.addEventListener('click', () => this.startBot());
        stopBtn.addEventListener('click', () => this.stopBot());

        // Update settings on input change
        [volumeInput, frequencyInput, stabilityInput].forEach(input => {
            input.addEventListener('change', () => this.updateSettings());
        });
    }

    // Update settings from UI
    updateSettings() {
        this.volumeTarget = parseFloat(document.getElementById('volume-target').value) || this.volumeTarget;
        this.tradeFrequency = parseInt(document.getElementById('trade-frequency').value) || this.tradeFrequency;
        this.priceStability = (parseFloat(document.getElementById('price-stability').value) || this.priceStability) / 100;
        this.saveSettings();
    }

    // Start market making bot
    startBot() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.updateSettings();
        
        const statusElement = document.getElementById('bot-status');
        const startBtn = document.getElementById('start-bot');
        const stopBtn = document.getElementById('stop-bot');
        
        statusElement.textContent = 'Running';
        statusElement.className = 'text-green-400 font-medium';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        
        this.startTrading();
        this.saveSettings();
        
        console.log('Market Maker started:', {
            volumeTarget: this.volumeTarget,
            tradeFrequency: this.tradeFrequency,
            priceStability: this.priceStability
        });
    }

    // Stop market making bot
    stopBot() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        
        const statusElement = document.getElementById('bot-status');
        const startBtn = document.getElementById('start-bot');
        const stopBtn = document.getElementById('stop-bot');
        
        statusElement.textContent = 'Stopped';
        statusElement.className = 'text-red-400 font-medium';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        
        if (this.tradingInterval) {
            clearInterval(this.tradingInterval);
        }
        
        this.saveSettings();
        console.log('Market Maker stopped');
    }

    // Main trading loop
    startTrading() {
        this.tradingInterval = setInterval(() => {
            if (!this.isRunning) return;
            
            this.executeTrade();
            this.updateStats();
        }, this.tradeFrequency);
    }

    // Execute a single trade
    executeTrade() {
        const tradeTypes = ['buy', 'sell'];
        const type = tradeTypes[Math.floor(Math.random() * tradeTypes.length)];
        
        // Select wallet using weighted random selection
        const selectedWallet = this.selectWallet();
        
        // Generate realistic trade size based on wallet balance
        const baseSize = this.volumeTarget / 1000; // Average trade size
        const variation = 0.5 + Math.random(); // 0.5 to 1.5x variation
        const walletMultiplier = selectedWallet.balance / 2500; // Scale by wallet size
        const size = baseSize * variation * walletMultiplier;
        
        const trade = {
            id: Date.now() + Math.random(),
            type: type,
            size: size,
            price: this.generatePrice(),
            timestamp: Date.now(),
            wallet: selectedWallet.address,
            walletIndex: this.wallets.indexOf(selectedWallet)
        };
        
        this.trades.push(trade);
        
        // Broadcast trade to WebSocket
        if (this.ws) {
            this.ws.send(JSON.stringify({
                type: 'trade',
                data: trade
            }));
        }
        
        // Simulate price impact
        this.updateMarketPrice(trade);
        
        console.log(`Trade executed from ${selectedWallet.address}:`, trade);
    }

    // Select wallet using weighted random selection
    selectWallet() {
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (const wallet of this.wallets) {
            cumulativeWeight += wallet.usageWeight;
            if (random <= cumulativeWeight) {
                return wallet;
            }
        }
        
        // Fallback to first wallet
        return this.wallets[0];
    }

    // Generate realistic price
    generatePrice() {
        const basePrice = 0.001337; // Base price
        const volatility = this.priceStability;
        const trend = Math.sin(Date.now() / 100000) * 0.001; // Long-term trend
        const noise = (Math.random() - 0.5) * volatility;
        
        return Math.max(basePrice + trend + noise, 0.0001);
    }

    // Update market price based on trades
    updateMarketPrice(trade) {
        // Simulate price impact from trades
        const impact = trade.type === 'buy' ? 0.0001 : -0.0001;
        
        // Update global price if available
        if (window.darkSatoshi) {
            window.darkSatoshi.currentPrice = Math.max(
                window.darkSatoshi.currentPrice + impact,
                0.0001
            );
        }
    }

    // Update statistics display
    updateStats() {
        const today = new Date().toDateString();
        const todayTrades = this.trades.filter(trade => 
            new Date(trade.timestamp).toDateString() === today
        );
        
        const dailyVolume = todayTrades.reduce((sum, trade) => sum + trade.size, 0);
        const totalTrades = this.trades.length;
        const avgTrade = totalTrades > 0 ? 
            this.trades.reduce((sum, trade) => sum + trade.size, 0) / totalTrades : 0;
        
        // Calculate wallet-specific stats
        const walletStats = this.wallets.map(wallet => {
            const walletTrades = this.trades.filter(trade => trade.wallet === wallet.address);
            return {
                address: wallet.address,
                trades: walletTrades.length,
                volume: walletTrades.reduce((sum, trade) => sum + trade.size, 0)
            };
        });
        
        // Update UI
        const volumeElement = document.getElementById('daily-volume');
        const tradesElement = document.getElementById('total-trades');
        const avgElement = document.getElementById('avg-trade');
        
        if (volumeElement) volumeElement.textContent = '$' + dailyVolume.toFixed(0);
        if (tradesElement) tradesElement.textContent = totalTrades;
        if (avgElement) avgElement.textContent = '$' + avgTrade.toFixed(2);
        
        // Log wallet performance
        console.log('Wallet Performance:', walletStats);
    }

    // Get trading statistics
    getStats() {
        return {
            isRunning: this.isRunning,
            totalTrades: this.trades.length,
            dailyVolume: this.trades
                .filter(trade => new Date(trade.timestamp).toDateString() === new Date().toDateString())
                .reduce((sum, trade) => sum + trade.size, 0),
            averageTradeSize: this.trades.length > 0 ?
                this.trades.reduce((sum, trade) => sum + trade.size, 0) / this.trades.length : 0
        };
    }

    // Export trade history
    exportTrades() {
        const csvContent = "data:text/csv;charset=utf-8," + 
            "ID,Type,Size,Price,Timestamp\n" +
            this.trades.map(trade => 
                `${trade.id},${trade.type},${trade.size},${trade.price},${new Date(trade.timestamp).toISOString()}`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "dark_satoshi_trades.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Advanced trading strategies
class TradingStrategies {
    static arbitrage(exchanges) {
        // Find price differences across exchanges
        const prices = exchanges.map(ex => ({ name: ex.name, price: ex.getPrice() }));
        const maxPrice = Math.max(...prices.map(p => p.price));
        const minPrice = Math.min(...prices.map(p => p.price));
        const spread = (maxPrice - minPrice) / minPrice;
        
        if (spread > 0.005) { // 0.5% minimum spread
            return {
                buy: prices.find(p => p.price === minPrice),
                sell: prices.find(p => p.price === maxPrice),
                profit: spread
            };
        }
        return null;
    }
    
    static momentumTrading(priceHistory) {
        // Simple momentum strategy
        if (priceHistory.length < 10) return null;
        
        const recent = priceHistory.slice(-5);
        const older = priceHistory.slice(-10, -5);
        
        const recentAvg = recent.reduce((sum, p) => sum + p, 0) / recent.length;
        const olderAvg = older.reduce((sum, p) => sum + p, 0) / older.length;
        
        const momentum = (recentAvg - olderAvg) / olderAvg;
        
        if (momentum > 0.01) return 'buy';
        if (momentum < -0.01) return 'sell';
        return 'hold';
    }
    
    static gridTrading(currentPrice, gridLevels = 10) {
        const grids = [];
        const step = currentPrice * 0.001; // 0.1% steps
        
        for (let i = -gridLevels/2; i < gridLevels/2; i++) {
            grids.push({
                price: currentPrice + (i * step),
                buy: i < 0,
                sell: i > 0
            });
        }
        
        return grids;
    }
}

// Initialize market maker when page loads
let marketMaker;
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        marketMaker = new MarketMaker();
        
        // Add keyboard shortcut to toggle panel (Ctrl+Shift+K)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'K') {
                e.preventDefault();
                const panel = document.getElementById('market-maker-panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                } else if (marketMaker) {
                    marketMaker.createControlPanel();
                }
            }
        });
    }
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.darkSatoshi && document.hidden) {
        // Pause animations when page is hidden
    } else if (window.darkSatoshi && !document.hidden) {
        // Resume animations when page is visible
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MarketMaker, TradingStrategies };
}