import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: hasAdminRole } = await supabaseClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!hasAdminRole) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { url } = await req.json();

    console.log('Fetching content from URL:', url);
    
    // Fetch the webpage
    const pageResponse = await fetch(url);
    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch URL: ${pageResponse.status}`);
    }
    
    const html = await pageResponse.text();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert at extracting article content from HTML. 
Extract the article information and return it as a JSON object with this exact structure:
{
  "title": "article title",
  "author": "author name or 'Maya Joelson' if not found",
  "publishedDate": "YYYY-MM-DD format",
  "category": "one of: Policy Analysis, Market Trends, Trade Relations, Economic Indicators, Investment Insights",
  "excerpt": "brief 2-3 sentence summary",
  "content": "full article content in clean HTML with proper formatting (h2, h3, p, ul, ol tags)",
  "images": [
    {"url": "image url", "caption": "image caption or alt text"}
  ],
  "externalLink": "original article URL"
}

Focus on:
- Clean, properly formatted HTML (use h2 for main sections, h3 for subsections)
- Preserve the article structure and formatting
- Extract all images with their captions
- Remove navigation, ads, and other non-article content
- Ensure the excerpt is compelling and accurate`;

    console.log('Calling Lovable AI to extract content...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Extract the article content from this HTML:\n\nSource URL: ${url}\n\nHTML:\n${html.substring(0, 50000)}` 
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI usage limit reached. Please add credits to your workspace.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response from AI
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const extractedData = JSON.parse(jsonMatch[0]);
    extractedData.externalLink = url; // Ensure we set the original URL
    
    console.log('Successfully extracted article content');

    return new Response(JSON.stringify(extractedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-migrate-story:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
