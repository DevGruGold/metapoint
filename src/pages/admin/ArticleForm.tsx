import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import AdminLayout from '@/components/AdminLayout';
import RichTextEditor from '@/components/RichTextEditor';
import { ArrowLeft } from 'lucide-react';

const categories = ['Markets', 'Geopolitics', 'Economic Policy', 'Technology', 'Commentary'];

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [category, setCategory] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [externalLink, setExternalLink] = useState('');

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSlug(article.slug);
      setExcerpt(article.excerpt);
      setFullContent(article.full_content);
      setCategory(article.category);
      setPublishedDate(article.published_date);
      setIsFeatured(article.is_featured);
      setExternalLink(article.external_link || '');
    }
  }, [article]);

  useEffect(() => {
    if (!isEditing && title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  }, [title, slug, isEditing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const articleData = {
        title,
        slug,
        excerpt,
        full_content: fullContent,
        category,
        published_date: publishedDate,
        is_featured: isFeatured,
        external_link: externalLink || null,
        created_by: user?.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('newsletters')
          .update(articleData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('newsletters').insert([articleData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      queryClient.invalidateQueries({ queryKey: ['newsletters'] });
      queryClient.invalidateQueries({ queryKey: ['featured-newsletters'] });
      toast.success(isEditing ? 'Article updated successfully' : 'Article created successfully');
      navigate('/admin/articles');
    },
    onError: (error: any) => {
      if (error.message.includes('duplicate key')) {
        toast.error('An article with this slug already exists');
      } else {
        toast.error('Failed to save article');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !slug || !excerpt || !fullContent || !category || !publishedDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    saveMutation.mutate();
  };

  if (isEditing && isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/articles')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-6">
          {isEditing ? 'Edit Article' : 'Create New Article'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="article-url-slug"
              required
            />
            <p className="text-xs text-muted-foreground">
              Will be used in the article URL: /articles/{slug || 'article-slug'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedDate">Published Date *</Label>
              <Input
                id="publishedDate"
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary (2-3 sentences)"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">
              {excerpt.length} characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullContent">Full Content *</Label>
            <RichTextEditor
              content={fullContent}
              onChange={setFullContent}
              placeholder="Write your article content with rich formatting..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalLink">External Link (Optional)</Label>
            <Input
              id="externalLink"
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://example.com/article"
            />
            <p className="text-xs text-muted-foreground">
              Link to original article on Constant Contact or Substack
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
            <Label htmlFor="featured">Featured (show on homepage)</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : isEditing ? 'Update Article' : 'Create Article'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/articles')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ArticleForm;
