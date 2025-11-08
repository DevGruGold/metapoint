-- Add featured_image column to newsletters table for social sharing
ALTER TABLE public.newsletters 
ADD COLUMN featured_image text;

-- Add comment to explain the column
COMMENT ON COLUMN public.newsletters.featured_image IS 'URL of the featured image for social sharing (og:image). Falls back to default if null.';