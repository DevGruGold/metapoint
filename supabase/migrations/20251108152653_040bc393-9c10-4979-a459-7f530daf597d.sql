-- Add SEO fields to newsletters table
ALTER TABLE public.newsletters
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS keywords TEXT[],
ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.newsletters.meta_description IS 'SEO meta description (150-160 characters recommended)';
COMMENT ON COLUMN public.newsletters.keywords IS 'Array of SEO keywords for the article';
COMMENT ON COLUMN public.newsletters.focus_keyword IS 'Primary focus keyword for SEO optimization';
