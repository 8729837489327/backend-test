// Load configuration from Cloudflare Workers API
async function loadConfig() {
    try {
        console.log('Fetching config from /api/config...');
        const response = await fetch('/api/config');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const config = await response.json();
        console.log('Config loaded:', config);
        
        if (config) {
            applyConfig(config);
        }
    } catch (error) {
        console.error('Failed to load config from API, using localStorage:', error);
        // Try localStorage as fallback for local development
        const localConfig = localStorage.getItem('linktreeConfig');
        if (localConfig) {
            applyConfig(JSON.parse(localConfig));
        } else {
            // Use default config if API fails and no localStorage
            applyConfig(getDefaultConfig());
        }
    }
}

function applyConfig(config) {
    // Apply profile settings
    if (config.name) {
        document.getElementById('profileName').textContent = config.name;
    }
    if (config.bio) {
        document.getElementById('profileBio').textContent = config.bio;
    }
    if (config.profileImage) {
        document.getElementById('profileImage').src = config.profileImage;
    }
    
    // Apply appearance settings
    if (config.bgColor) {
        document.documentElement.style.setProperty('--bg-color', config.bgColor);
    }
    if (config.textColor) {
        document.documentElement.style.setProperty('--text-color', config.textColor);
    }
    if (config.accentColor) {
        document.documentElement.style.setProperty('--accent-color', config.accentColor);
    }
    
    // Apply links
    if (config.links && Array.isArray(config.links)) {
        const linksContainer = document.getElementById('linksContainer');
        linksContainer.innerHTML = '';
        
        config.links.forEach(link => {
            const linkCard = document.createElement('a');
            linkCard.className = 'link-card';
            linkCard.href = link.url;
            linkCard.textContent = link.title;
            linkCard.target = '_blank';
            linkCard.rel = 'noopener noreferrer';
            linksContainer.appendChild(linkCard);
        });
    }
}

function getDefaultConfig() {
    return {
        name: 'Your Name',
        bio: 'Your bio goes here',
        profileImage: 'https://via.placeholder.com/150',
        bgColor: '#1a1a2e',
        textColor: '#ffffff',
        accentColor: '#6c5ce7',
        links: []
    };
}

// Load config on page load
document.addEventListener('DOMContentLoaded', loadConfig);
