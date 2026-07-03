let currentConfig = null;

// Load configuration on page load
async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        currentConfig = await response.json();
        
        populateForm(currentConfig);
    } catch (error) {
        console.error('Failed to load config:', error);
        currentConfig = getDefaultConfig();
        populateForm(currentConfig);
    }
}

function getDefaultConfig() {
    return {
        name: '',
        bio: '',
        profileImage: '',
        bgColor: '#1a1a2e',
        textColor: '#ffffff',
        accentColor: '#6c5ce7',
        links: []
    };
}

function populateForm(config) {
    document.getElementById('name').value = config.name || '';
    document.getElementById('bio').value = config.bio || '';
    document.getElementById('profileImage').value = config.profileImage || '';
    document.getElementById('bgColor').value = config.bgColor || '#1a1a2e';
    document.getElementById('textColor').value = config.textColor || '#ffffff';
    document.getElementById('accentColor').value = config.accentColor || '#6c5ce7';
    
    // Populate links
    const linksEditor = document.getElementById('linksEditor');
    linksEditor.innerHTML = '';
    
    if (config.links && Array.isArray(config.links)) {
        config.links.forEach(link => addLinkItem(link.title, link.url));
    }
}

function addLinkItem(title = '', url = '') {
    const linksEditor = document.getElementById('linksEditor');
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';
    
    linkItem.innerHTML = `
        <input type="text" class="link-title" placeholder="Link title" value="${title}">
        <input type="text" class="link-url" placeholder="https://example.com" value="${url}">
        <button class="remove-btn" onclick="removeLinkItem(this)">Remove</button>
    `;
    
    linksEditor.appendChild(linkItem);
}

function removeLinkItem(button) {
    button.parentElement.remove();
}

function collectFormData() {
    const linkItems = document.querySelectorAll('.link-item');
    const links = [];
    
    linkItems.forEach(item => {
        const title = item.querySelector('.link-title').value.trim();
        const url = item.querySelector('.link-url').value.trim();
        
        if (title && url) {
            links.push({ title, url });
        }
    });
    
    return {
        name: document.getElementById('name').value.trim(),
        bio: document.getElementById('bio').value.trim(),
        profileImage: document.getElementById('profileImage').value.trim(),
        bgColor: document.getElementById('bgColor').value,
        textColor: document.getElementById('textColor').value,
        accentColor: document.getElementById('accentColor').value,
        links: links
    };
}

async function saveConfig() {
    const config = collectFormData();
    const statusMessage = document.getElementById('statusMessage');
    
    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(config)
        });
        
        if (response.ok) {
            statusMessage.textContent = 'Changes saved successfully!';
            statusMessage.className = 'status-message success';
            currentConfig = config;
        } else {
            throw new Error('Failed to save config');
        }
    } catch (error) {
        console.error('Failed to save config:', error);
        statusMessage.textContent = 'Failed to save changes. Please try again.';
        statusMessage.className = 'status-message error';
    }
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

function previewChanges() {
    const config = collectFormData();
    localStorage.setItem('previewConfig', JSON.stringify(config));
    window.open('/', '_blank');
}

// Event listeners
document.getElementById('addLinkBtn').addEventListener('click', () => addLinkItem());
document.getElementById('saveBtn').addEventListener('click', saveConfig);
document.getElementById('previewBtn').addEventListener('click', previewChanges);

// Load config on page load
document.addEventListener('DOMContentLoaded', loadConfig);
