// Cloudflare Pages Function for handling linktree configuration
// Uses Cloudflare D1 Database for storage

export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // GET /api/config - Retrieve configuration
  if (request.method === 'GET') {
    try {
      const result = await env.DB.prepare('SELECT * FROM config WHERE id = 1').first();
      
      if (result) {
        const config = {
          name: result.name,
          bio: result.bio,
          profileImage: result.profile_image,
          bgColor: result.bg_color,
          textColor: result.text_color,
          accentColor: result.accent_color,
          links: JSON.parse(result.links)
        };
        
        return new Response(JSON.stringify(config), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } else {
        // Return default config if none exists
        const defaultConfig = {
          name: 'Your Name',
          bio: 'Your bio goes here',
          profileImage: 'https://via.placeholder.com/150',
          bgColor: '#1a1a2e',
          textColor: '#ffffff',
          accentColor: '#6c5ce7',
          links: []
        };
        
        return new Response(JSON.stringify(defaultConfig), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to retrieve config' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  }

  // POST /api/config - Save configuration
  if (request.method === 'POST') {
    try {
      const config = await request.json();
      
      // Validate required fields
      if (!config || typeof config !== 'object') {
        return new Response(JSON.stringify({ error: 'Invalid config data' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Check if config exists
      const existing = await env.DB.prepare('SELECT id FROM config WHERE id = 1').first();

      if (existing) {
        // Update existing config
        await env.DB.prepare(`
          UPDATE config 
          SET name = ?, bio = ?, profile_image = ?, bg_color = ?, 
              text_color = ?, accent_color = ?, links = ?, updated_at = ?
          WHERE id = 1
        `).bind(
          config.name,
          config.bio,
          config.profileImage,
          config.bgColor,
          config.textColor,
          config.accentColor,
          JSON.stringify(config.links),
          new Date().toISOString()
        ).run();
      } else {
        // Insert new config
        await env.DB.prepare(`
          INSERT INTO config (id, name, bio, profile_image, bg_color, text_color, accent_color, links, updated_at)
          VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          config.name,
          config.bio,
          config.profileImage,
          config.bgColor,
          config.textColor,
          config.accentColor,
          JSON.stringify(config.links),
          new Date().toISOString()
        ).run();
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to save config' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  }

  // 404 for unknown routes
  return new Response('Not Found', {
    status: 404,
    headers: corsHeaders,
  });
}
