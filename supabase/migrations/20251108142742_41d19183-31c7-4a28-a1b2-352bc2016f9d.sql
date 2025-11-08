-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-images',
  'article-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- RLS policy: Only admins can upload images
CREATE POLICY "Admins can upload article images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'article-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS policy: Only admins can update images
CREATE POLICY "Admins can update article images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'article-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS policy: Only admins can delete images
CREATE POLICY "Admins can delete article images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'article-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS policy: Anyone can view images (public bucket)
CREATE POLICY "Anyone can view article images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'article-images');