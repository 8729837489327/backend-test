// Load configuration from Cloudflare Workers API
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        if (config) {
            applyConfig(config);
        }
    } catch (error) {
        console.error('Failed to load config:', error);
        // Use default config if API fails
        applyConfig(getDefaultConfig());
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
