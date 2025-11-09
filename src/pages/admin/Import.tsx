import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Rss, FileJson, Loader2, Database, Trash2, ExternalLink, Zap } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ParsedArticle {
  title: string;
  excerpt: string;
  full_content: string;
  category: string;
  published_date: string;
  author?: string;
  external_link?: string;
  featured_image?: string;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const parseCSV = (csvText: string): ParsedArticle[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const article: any = {};
    
    headers.forEach((header, index) => {
      article[header] = values[index] || '';
    });
    
    return {
      title: article.title || 'Untitled',
      excerpt: article.excerpt || article.title?.substring(0, 150) || '',
      full_content: article.content || article.full_content || '',
      category: article.category || 'Insights',
      published_date: article.published_date || article.date || new Date().toISOString().split('T')[0],
      author: article.author || 'Maya Joelson',
      external_link: article.external_link || article.link || '',
      featured_image: article.featured_image || '',
    };
  });
};

const parseJSON = (jsonText: string): ParsedArticle[] => {
  const data = JSON.parse(jsonText);
  const articles = Array.isArray(data) ? data : [data];
  
  return articles.map(article => ({
    title: article.title || 'Untitled',
    excerpt: article.excerpt || article.description || article.title?.substring(0, 150) || '',
    full_content: article.content || article.full_content || article.body || '',
    category: article.category || article.tags?.[0] || 'Insights',
    published_date: article.published_date || article.pubDate || article.date || new Date().toISOString().split('T')[0],
    author: article.author || 'Maya Joelson',
    external_link: article.external_link || article.url || article.link || '',
    featured_image: article.featured_image || article.image || '',
  }));
};

const createSampleArticles = (): ParsedArticle[] => {
  return [
    {
      title: "The Future of AI in Investment Analysis",
      excerpt: "Exploring how artificial intelligence is revolutionizing the way we analyze market trends and investment opportunities.",
      full_content: "<p>Artificial intelligence is transforming the investment landscape at an unprecedented pace. As we look ahead, several key trends are emerging that will shape how investors approach market analysis.</p><p>Machine learning algorithms are now capable of processing vast amounts of financial data in real-time, identifying patterns that would be impossible for human analysts to detect. This technology is democratizing access to sophisticated investment insights.</p>",
      category: "Technology",
      published_date: "2024-03-15",
      author: "Maya Joelson",
      external_link: "",
      featured_image: "",
    },
    {
      title: "Understanding Market Volatility in 2024",
      excerpt: "A comprehensive guide to navigating uncertain markets and making informed investment decisions during turbulent times.",
      full_content: "<p>Market volatility has become the new normal in today's interconnected global economy. Understanding the drivers behind these fluctuations is crucial for maintaining a balanced investment portfolio.</p><p>Recent geopolitical events, coupled with shifts in monetary policy, have created an environment where traditional market indicators may not tell the full story. Investors need a multi-faceted approach to risk management.</p>",
      category: "Market Analysis",
      published_date: "2024-03-10",
      author: "Maya Joelson",
      external_link: "",
      featured_image: "",
    },
    {
      title: "ESG Investing: Beyond the Buzzwords",
      excerpt: "Diving deep into environmental, social, and governance factors and their real impact on long-term investment returns.",
      full_content: "<p>ESG investing has evolved from a niche strategy to a mainstream consideration for serious investors. But what does it really mean to invest with ESG principles in mind?</p><p>Research shows that companies with strong ESG practices often demonstrate better risk management and long-term sustainability. This isn't just about feeling good—it's about making smart investment decisions.</p>",
      category: "Sustainable Investing",
      published_date: "2024-03-05",
      author: "Maya Joelson",
      external_link: "",
      featured_image: "",
    },
  ];
};

const Import = () => {
  const [parsedArticles, setParsedArticles] = useState<ParsedArticle[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [rssUrl, setRssUrl] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [isImportingUrl, setIsImportingUrl] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [articleCount, setArticleCount] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchArticleCount = async () => {
    const { count, error } = await supabase
      .from('newsletters')
      .select('*', { count: 'exact', head: true });
    
    if (!error) {
      setArticleCount(count);
    }
  };

  useEffect(() => {
    fetchArticleCount();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'csv' | 'json') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const articles = type === 'csv' ? parseCSV(text) : parseJSON(text);
        setParsedArticles(articles);
        toast({
          title: "File parsed successfully",
          description: `Found ${articles.length} articles`,
        });
      } catch (error) {
        toast({
          title: "Parse error",
          description: "Failed to parse file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleJSONParse = () => {
    try {
      const articles = parseJSON(jsonText);
      setParsedArticles(articles);
      toast({
        title: "JSON parsed successfully",
        description: `Found ${articles.length} articles`,
      });
    } catch (error) {
      toast({
        title: "Parse error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const handleLoadSamples = () => {
    const samples = createSampleArticles();
    setParsedArticles(samples);
    toast({
      title: "Sample articles loaded",
      description: `Loaded ${samples.length} sample articles`,
    });
  };

  const handleQuickLoadSamples = async () => {
    const samples = createSampleArticles();
    setParsedArticles(samples);
    
    setIsImporting(true);
    const { data: { user } } = await supabase.auth.getUser();
    let successCount = 0;

    for (const article of samples) {
      const slug = generateSlug(article.title);
      try {
        const { error } = await supabase.from('newsletters').insert({
          title: article.title,
          slug: slug,
          excerpt: article.excerpt,
          full_content: article.full_content,
          category: article.category,
          published_date: article.published_date,
          author: article.author || 'Maya Joelson',
          external_link: article.external_link || null,
          featured_image: article.featured_image || null,
          created_by: user?.id,
          is_featured: false,
        });
        if (!error) successCount++;
      } catch (error) {
        console.error('Import error:', error);
      }
    }

    setIsImporting(false);
    await fetchArticleCount();
    
    toast({
      title: "Sample articles imported",
      description: `Successfully imported ${successCount} sample articles`,
    });
  };

  const handleClearAllArticles = async () => {
    setIsClearing(true);
    const { error } = await supabase.from('newsletters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    setIsClearing(false);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to clear articles",
        variant: "destructive",
      });
    } else {
      await fetchArticleCount();
      setParsedArticles([]);
      toast({
        title: "All articles cleared",
        description: "Database has been reset",
      });
    }
  };

  const handleImport = async () => {
    if (parsedArticles.length === 0) {
      toast({
        title: "No articles to import",
        description: "Please parse articles first",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    let successCount = 0;
    let errorCount = 0;

    const { data: { user } } = await supabase.auth.getUser();

    for (let i = 0; i < parsedArticles.length; i++) {
      const article = parsedArticles[i];
      const slug = generateSlug(article.title);

      try {
        const { error } = await supabase.from('newsletters').insert({
          title: article.title,
          slug: slug,
          excerpt: article.excerpt,
          full_content: article.full_content,
          category: article.category,
          published_date: article.published_date,
          author: article.author || 'Maya Joelson',
          external_link: article.external_link || null,
          featured_image: article.featured_image || null,
          created_by: user?.id,
          is_featured: false,
        });

        if (error) throw error;
        successCount++;
      } catch (error) {
        console.error('Import error:', error);
        errorCount++;
      }

      setImportProgress(((i + 1) / parsedArticles.length) * 100);
    }

    setIsImporting(false);
    
    await fetchArticleCount();
    
    toast({
      title: "Import complete",
      description: `Successfully imported ${successCount} articles. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
    });

    if (successCount > 0) {
      setTimeout(() => navigate('/admin/articles'), 1500);
    }
  };

  const handleUrlImport = async () => {
    if (!articleUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter an article URL",
        variant: "destructive",
      });
      return;
    }

    setIsImportingUrl(true);

    try {
      console.log('Calling ai-migrate-story with URL:', articleUrl);
      
      const { data, error } = await supabase.functions.invoke('ai-migrate-story', {
        body: { url: articleUrl }
      });

      if (error) {
        console.error('Edge Function error:', error);
        toast({
          title: "Import failed",
          description: error.message || "Failed to fetch article content",
          variant: "destructive",
        });
        setIsImportingUrl(false);
        return;
      }

      console.log('Article extracted successfully:', data);

      // Insert into database
      const { data: { user } } = await supabase.auth.getUser();
      const slug = generateSlug(data.title);

      console.log('Inserting article into database...');
      const { error: insertError } = await supabase.from('newsletters').insert({
        title: data.title,
        slug: slug,
        excerpt: data.excerpt,
        full_content: data.content,
        category: data.category || 'Investment Insights',
        published_date: data.publishedDate,
        author: data.author || 'Maya Joelson',
        external_link: data.externalLink || articleUrl,
        featured_image: data.images?.[0]?.url || null,
        created_by: user?.id,
        is_featured: false,
      });

      if (insertError) {
        console.error('Database insert error:', insertError);
        toast({
          title: "Import failed",
          description: insertError.message || "Failed to save article",
          variant: "destructive",
        });
        setIsImportingUrl(false);
        return;
      }

      console.log('Article saved successfully');
      toast({
        title: "Article imported successfully",
        description: `"${data.title}" has been added`,
      });

      setArticleUrl('');
      await fetchArticleCount();
      setTimeout(() => navigate('/admin/articles'), 1500);

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImportingUrl(false);
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Import Articles</h1>
            <p className="text-muted-foreground mt-2">
              Bulk import articles from various sources
            </p>
          </div>
          <Card className="w-full md:w-48">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {articleCount !== null ? articleCount : '...'}
                  </p>
                  <p className="text-xs text-muted-foreground">Articles in DB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              One-click operations for testing and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Button
                onClick={handleQuickLoadSamples}
                disabled={isImporting}
                variant="default"
                className="w-full"
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Load Sample Data
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isClearing || articleCount === 0} className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Articles
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all {articleCount} articles from the database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAllArticles} className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {isClearing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        'Delete All'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                onClick={() => window.open('/archive', '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Archive
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="samples" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="url">
            <ExternalLink className="w-4 h-4 mr-2" />
            URL
          </TabsTrigger>
            <TabsTrigger value="samples">
              <FileText className="w-4 h-4 mr-2" />
              Samples
            </TabsTrigger>
            <TabsTrigger value="csv">
              <Upload className="w-4 h-4 mr-2" />
              CSV
            </TabsTrigger>
            <TabsTrigger value="json">
              <FileJson className="w-4 h-4 mr-2" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="paste">
              <Rss className="w-4 h-4 mr-2" />
              Paste
            </TabsTrigger>
          </TabsList>


          <TabsContent value="url">
            <Card>
              <CardHeader>
                <CardTitle>Import from URL</CardTitle>
                <CardDescription>
                  Enter a ConstantContact newsletter URL to import it automatically using AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="articleUrl">Article URL</Label>
                  <Input
                    id="articleUrl"
                    type="url"
                    placeholder="https://conta.cc/... or https://myemail.constantcontact.com/..."
                    value={articleUrl}
                    onChange={(e) => setArticleUrl(e.target.value)}
                    disabled={isImportingUrl}
                  />
                </div>

                <Button 
                  onClick={handleUrlImport} 
                  disabled={isImportingUrl || !articleUrl.trim()}
                  className="w-full"
                >
                  {isImportingUrl ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing... (this may take 30-60 seconds)
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Import Article
                    </>
                  )}
                </Button>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">How it works:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Paste the ConstantContact newsletter URL</li>
                    <li>AI extracts the article content, images, and metadata</li>
                    <li>Article is automatically formatted and saved to database</li>
                    <li>You'll be redirected to the articles list</li>
                  </ol>
                  <p className="mt-3 text-sm text-amber-600 font-medium">
                    ⚠️ Note: Requires LOVABLE_API_KEY to be configured in Edge Function secrets
                  </p>
                </div>

                {!articleUrl && (
                  <div className="mt-4">
                    <Label className="text-sm font-semibold">Newsletter URLs to Import:</Label>
                    <div className="mt-2 space-y-2">
                      <button
                        onClick={() => setArticleUrl('https://conta.cc/3XBvQ4S')}
                        className="block w-full text-left text-sm text-blue-600 hover:bg-blue-50 p-2 rounded"
                      >
                        Black Swan/Black Bat (COVID-19 market analysis)
                      </button>
                      <p className="text-xs text-muted-foreground">
                        Click to load example URL, or paste your own ConstantContact newsletter URL
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="samples">
            <Card>
              <CardHeader>
                <CardTitle>Load Sample Articles</CardTitle>
                <CardDescription>
                  Quickly load sample articles for testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleLoadSamples}>
                  Load 3 Sample Articles
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV File</CardTitle>
                <CardDescription>
                  Expected columns: title, excerpt, content, category, published_date, author, external_link
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="csv-file">CSV File</Label>
                    <Input
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={(e) => handleFileUpload(e, 'csv')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json">
            <Card>
              <CardHeader>
                <CardTitle>Upload JSON File</CardTitle>
                <CardDescription>
                  Upload a JSON file with article data (array or single object)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="json-file">JSON File</Label>
                    <Input
                      id="json-file"
                      type="file"
                      accept=".json"
                      onChange={(e) => handleFileUpload(e, 'json')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paste">
            <Card>
              <CardHeader>
                <CardTitle>Paste JSON Data</CardTitle>
                <CardDescription>
                  Paste article data in JSON format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="json-text">JSON Data</Label>
                    <Textarea
                      id="json-text"
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                      placeholder='[{"title": "Article Title", "excerpt": "...", "content": "...", ...}]'
                      rows={10}
                      className="font-mono text-sm"
                    />
                  </div>
                  <Button onClick={handleJSONParse}>Parse JSON</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {parsedArticles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview ({parsedArticles.length} articles)</CardTitle>
              <CardDescription>
                Review articles before importing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Author</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedArticles.map((article, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>{article.published_date}</TableCell>
                          <TableCell>{article.author}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {isImporting && (
                  <div className="space-y-2">
                    <Progress value={importProgress} />
                    <p className="text-sm text-muted-foreground text-center">
                      Importing... {Math.round(importProgress)}%
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="w-full"
                  size="lg"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import {parsedArticles.length} Articles
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Import;
