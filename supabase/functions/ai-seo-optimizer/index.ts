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

    const { data: hasAdminRole, error: roleError } = await supabaseClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Error checking admin role:', roleError);
      return new Response(JSON.stringify({ error: 'Failed to verify permissions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!hasAdminRole) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { title, content, excerpt, category } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert SEO consultant specializing in optimizing content for search engines and user engagement.
Analyze the provided article and generate comprehensive SEO recommendations.

Return your response as a JSON object with this exact structure:
{
  "metaDescription": "compelling 150-160 character meta description with primary keyword",
  "focusKeyword": "primary keyword or phrase",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "titleSuggestions": [
    "SEO-optimized title option 1 (under 60 chars)",
    "SEO-optimized title option 2 (under 60 chars)",
    "SEO-optimized title option 3 (under 60 chars)"
  ],
  "structureAnalysis": {
    "score": 85,
    "strengths": ["point 1", "point 2"],
    "improvements": ["suggestion 1", "suggestion 2", "suggestion 3"]
  },
  "readability": {
    "score": 80,
    "grade": "Professional",
    "suggestions": ["tip 1", "tip 2"]
  },
  "contentGaps": ["missing topic 1", "missing topic 2"],
  "internalLinkSuggestions": ["related topic 1", "related topic 2", "related topic 3"],
  "headingStructure": {
    "current": "current heading structure assessment",
    "recommended": "recommended improvements to heading hierarchy"
  },
  "keywordDensity": {
    "primary": "2.5%",
    "assessment": "optimal/too high/too low",
    "recommendation": "specific advice"
  }
}

Focus on:
- Creating compelling meta descriptions that include the focus keyword naturally
- Identifying high-value, relevant keywords for Chinese economic policy and global markets
- Ensuring titles are under 60 characters and include primary keyword
- Analyzing content structure for SEO best practices
- Identifying content gaps and opportunities for internal linking
- Assessing readability for the target audience (investment professionals, policy makers)`;

    const userPrompt = `Analyze this article for SEO optimization:

Title: ${title}
Category: ${category}
Excerpt: ${excerpt}

Content:
${content.replace(/<[^>]*>/g, '').substring(0, 8000)}

Provide comprehensive SEO analysis and recommendations.`;

    console.log('Calling Lovable AI for SEO analysis...');
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
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
    const responseContent = data.choices[0].message.content;
    
    // Parse the JSON response from AI
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const seoAnalysis = JSON.parse(jsonMatch[0]);
    console.log('Successfully generated SEO analysis');

    return new Response(JSON.stringify(seoAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-seo-optimizer:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
