import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, X, ExternalLink, CheckCircle2, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AIAssistantPanelProps {
  onClose: () => void;
  onApplyTitle: (title: string) => void;
  onApplyContent: (content: string) => void;
  onApplyCategory: (category: string) => void;
  onApplyExcerpt: (excerpt: string) => void;
  onApplyDate: (date: string) => void;
  onApplyAuthor: (author: string) => void;
  onApplyExternalLink: (link: string) => void;
  onApplyMetaDescription: (desc: string) => void;
  onApplyKeywords: (keywords: string[]) => void;
  onApplyFocusKeyword: (keyword: string) => void;
  currentContent: string;
  currentTitle: string;
  currentExcerpt: string;
  currentCategory: string;
}

export const AIAssistantPanel = ({
  onClose,
  onApplyTitle,
  onApplyContent,
  onApplyCategory,
  onApplyExcerpt,
  onApplyDate,
  onApplyAuthor,
  onApplyExternalLink,
  onApplyMetaDescription,
  onApplyKeywords,
  onApplyFocusKeyword,
  currentContent,
  currentTitle,
  currentExcerpt,
  currentCategory
}: AIAssistantPanelProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  // Story Ideas state
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('analytical');
  const [targetAudience, setTargetAudience] = useState('');
  const [ideas, setIdeas] = useState<any>(null);

  // Story Migration state
  const [url, setUrl] = useState('');
  const [migratedData, setMigratedData] = useState<any>(null);

  // Auto-Format state
  const [formatOptions, setFormatOptions] = useState({
    fixHeadings: true,
    optimizeParagraphs: true,
    structureLists: true,
    addAccessibility: true
  });
  const [formattedData, setFormattedData] = useState<any>(null);

  // SEO Optimizer state
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for the story",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIdeas(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-story-assistant', {
        body: { topic, tone, targetAudience }
      });

      if (error) throw error;

      setIdeas(data);
      toast({
        title: "Ideas generated!",
        description: "Review the suggestions below",
      });
    } catch (error: any) {
      console.error('Error generating ideas:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate ideas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateStory = async () => {
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to migrate content from",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setMigratedData(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-migrate-story', {
        body: { url }
      });

      if (error) throw error;

      setMigratedData(data);
      toast({
        title: "Story extracted!",
        description: "Review the content below before importing",
      });
    } catch (error: any) {
      console.error('Error migrating story:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to migrate story",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatContent = async () => {
    if (!currentContent || currentContent.trim() === '<p></p>' || !currentContent.trim()) {
      toast({
        title: "No content",
        description: "Please add some content to the editor first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setFormattedData(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-format-story', {
        body: { content: currentContent, options: formatOptions }
      });

      if (error) throw error;

      setFormattedData(data);
      toast({
        title: "Content formatted!",
        description: "Review the changes below",
      });
    } catch (error: any) {
      console.error('Error formatting content:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to format content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportMigratedStory = () => {
    if (!migratedData) return;

    onApplyTitle(migratedData.title);
    onApplyContent(migratedData.content);
    onApplyCategory(migratedData.category);
    onApplyExcerpt(migratedData.excerpt);
    onApplyDate(migratedData.publishedDate);
    onApplyAuthor(migratedData.author);
    onApplyExternalLink(migratedData.externalLink);

    toast({
      title: "Story imported!",
      description: "All fields have been populated. Review and publish.",
    });
  };

  const handleAnalyzeSEO = async () => {
    if (!currentTitle || !currentContent || currentContent.trim() === '<p></p>') {
      toast({
        title: "Content required",
        description: "Please add a title and content before analyzing SEO",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSeoAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-seo-optimizer', {
        body: { 
          title: currentTitle,
          content: currentContent,
          excerpt: currentExcerpt,
          category: currentCategory
        }
      });

      if (error) throw error;

      setSeoAnalysis(data);
      toast({
        title: "SEO analysis complete!",
        description: "Review the recommendations below",
      });
    } catch (error: any) {
      console.error('Error analyzing SEO:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze SEO",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const panelContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="ideas" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 m-4">
          <TabsTrigger value="ideas" className="text-xs sm:text-sm">Ideas</TabsTrigger>
          <TabsTrigger value="migrate" className="text-xs sm:text-sm">Migrate</TabsTrigger>
          <TabsTrigger value="format" className="text-xs sm:text-sm">Format</TabsTrigger>
          <TabsTrigger value="seo" className="text-xs sm:text-sm">SEO</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {/* Story Ideas Tab */}
            <TabsContent value="ideas" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic">Story Topic</Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., China's new trade policy impact on tech sector..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analytical">Analytical</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="audience">Target Audience (optional)</Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Investment professionals, Policy makers..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleGenerateIdeas} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Generate Ideas
                    </>
                  )}
                </Button>

                {ideas && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Title Suggestions
                      </h3>
                      <div className="space-y-2">
                        {ideas.titles?.map((title: string, idx: number) => (
                          <Button
                            key={idx}
                            variant="outline"
                            className="w-full justify-start text-left h-auto py-3"
                            onClick={() => {
                              onApplyTitle(title);
                              toast({ title: "Title applied!" });
                            }}
                          >
                            <span className="text-sm">{title}</span>
                          </Button>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold">Suggested Category</h3>
                      <Button
                        variant="outline"
                        onClick={() => {
                          onApplyCategory(ideas.suggestedCategory);
                          toast({ title: "Category applied!" });
                        }}
                      >
                        {ideas.suggestedCategory}
                      </Button>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold">Article Outline</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">{ideas.outline?.introduction}</p>
                        {ideas.outline?.sections?.map((section: any, idx: number) => (
                          <div key={idx} className="pl-3 border-l-2">
                            <p className="font-medium">{section.heading}</p>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {section.points?.map((point: string, pIdx: number) => (
                                <li key={pIdx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold">Key Points to Cover</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {ideas.keyPoints?.map((point: string, idx: number) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Story Migration Tab */}
            <TabsContent value="migrate" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="url">Article URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://metapoint.substack.com/p/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Paste the URL of an article to import (works with Substack, Medium, etc.)
                  </p>
                </div>

                <Button 
                  onClick={handleMigrateStory} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Import from URL
                    </>
                  )}
                </Button>

                {migratedData && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Article Extracted
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Title:</span> {migratedData.title}
                        </div>
                        <div>
                          <span className="font-medium">Author:</span> {migratedData.author}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {migratedData.publishedDate}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {migratedData.category}
                        </div>
                        <div>
                          <span className="font-medium">Excerpt:</span>
                          <p className="text-muted-foreground mt-1">{migratedData.excerpt}</p>
                        </div>
                        <div>
                          <span className="font-medium">Images found:</span> {migratedData.images?.length || 0}
                        </div>
                        <div>
                          <span className="font-medium">Content preview:</span>
                          <p className="text-muted-foreground mt-1 line-clamp-3">
                            {migratedData.content?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Button 
                      onClick={handleImportMigratedStory}
                      className="w-full"
                    >
                      Import This Story
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Auto-Format Tab */}
            <TabsContent value="format" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Formatting Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="fixHeadings"
                        checked={formatOptions.fixHeadings}
                        onCheckedChange={(checked) => 
                          setFormatOptions(prev => ({ ...prev, fixHeadings: checked as boolean }))
                        }
                      />
                      <label htmlFor="fixHeadings" className="text-sm cursor-pointer">
                        Fix heading hierarchy
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="optimizeParagraphs"
                        checked={formatOptions.optimizeParagraphs}
                        onCheckedChange={(checked) => 
                          setFormatOptions(prev => ({ ...prev, optimizeParagraphs: checked as boolean }))
                        }
                      />
                      <label htmlFor="optimizeParagraphs" className="text-sm cursor-pointer">
                        Optimize paragraph breaks
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="structureLists"
                        checked={formatOptions.structureLists}
                        onCheckedChange={(checked) => 
                          setFormatOptions(prev => ({ ...prev, structureLists: checked as boolean }))
                        }
                      />
                      <label htmlFor="structureLists" className="text-sm cursor-pointer">
                        Structure lists properly
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="addAccessibility"
                        checked={formatOptions.addAccessibility}
                        onCheckedChange={(checked) => 
                          setFormatOptions(prev => ({ ...prev, addAccessibility: checked as boolean }))
                        }
                      />
                      <label htmlFor="addAccessibility" className="text-sm cursor-pointer">
                        Add accessibility features
                      </label>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleFormatContent} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Formatting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Format Current Content
                    </>
                  )}
                </Button>

                {formattedData && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Changes Made
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {formattedData.changes?.map((change: string, idx: number) => (
                          <li key={idx}>{change}</li>
                        ))}
                      </ul>
                    </Card>

                    {formattedData.suggestions && formattedData.suggestions.length > 0 && (
                      <Card className="p-4 space-y-3">
                        <h3 className="font-semibold">Additional Suggestions</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {formattedData.suggestions?.map((suggestion: string, idx: number) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </Card>
                    )}

                    <Button 
                      onClick={() => {
                        onApplyContent(formattedData.formattedContent);
                        toast({ title: "Formatting applied!" });
                      }}
                      className="w-full"
                    >
                      Apply Formatting
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* SEO Optimizer Tab */}
            <TabsContent value="seo" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    AI will analyze your current article content and provide comprehensive SEO recommendations including meta descriptions, keywords, and structure improvements.
                  </p>
                </div>

                <Button 
                  onClick={handleAnalyzeSEO} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing SEO...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze SEO
                    </>
                  )}
                </Button>

                {seoAnalysis && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    {/* Meta Description */}
                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Meta Description
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {seoAnalysis.metaDescription}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Length: {seoAnalysis.metaDescription?.length || 0} characters
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onApplyMetaDescription(seoAnalysis.metaDescription);
                          toast({ title: "Meta description applied!" });
                        }}
                      >
                        Apply Meta Description
                      </Button>
                    </Card>

                    {/* Focus Keyword */}
                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold">Focus Keyword</h3>
                      <p className="text-sm font-mono bg-muted px-2 py-1 rounded inline-block">
                        {seoAnalysis.focusKeyword}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onApplyFocusKeyword(seoAnalysis.focusKeyword);
                          toast({ title: "Focus keyword applied!" });
                        }}
                      >
                        Apply Focus Keyword
                      </Button>
                    </Card>

                    {/* Keywords */}
                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold">Related Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {seoAnalysis.keywords?.map((keyword: string, idx: number) => (
                          <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onApplyKeywords(seoAnalysis.keywords);
                          toast({ title: "Keywords applied!" });
                        }}
                      >
                        Apply All Keywords
                      </Button>
                    </Card>

                    {/* Title Suggestions */}
                    {seoAnalysis.titleSuggestions && (
                      <Card className="p-4 space-y-3">
                        <h3 className="font-semibold">SEO-Optimized Titles</h3>
                        <div className="space-y-2">
                          {seoAnalysis.titleSuggestions?.map((title: string, idx: number) => (
                            <Button
                              key={idx}
                              variant="outline"
                              className="w-full justify-start text-left h-auto py-3"
                              onClick={() => {
                                onApplyTitle(title);
                                toast({ title: "Title applied!" });
                              }}
                            >
                              <span className="text-sm">{title}</span>
                            </Button>
                          ))}
                        </div>
                      </Card>
                    )}

                    {/* Structure Analysis */}
                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold">Content Structure</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Score: {seoAnalysis.structureAnalysis?.score}/100</p>
                        </div>
                        {seoAnalysis.structureAnalysis?.strengths?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-green-600">Strengths:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {seoAnalysis.structureAnalysis.strengths.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {seoAnalysis.structureAnalysis?.improvements?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-orange-600">Improvements:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {seoAnalysis.structureAnalysis.improvements.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Readability */}
                    <Card className="p-4 space-y-3">
                      <h3 className="font-semibold">Readability</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Score:</span> {seoAnalysis.readability?.score}/100</p>
                        <p><span className="font-medium">Grade:</span> {seoAnalysis.readability?.grade}</p>
                        {seoAnalysis.readability?.suggestions?.length > 0 && (
                          <div>
                            <p className="font-medium">Suggestions:</p>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {seoAnalysis.readability.suggestions.map((item: string, idx: number) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Keyword Density */}
                    {seoAnalysis.keywordDensity && (
                      <Card className="p-4 space-y-3">
                        <h3 className="font-semibold">Keyword Density</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Primary keyword:</span> {seoAnalysis.keywordDensity.primary}</p>
                          <p><span className="font-medium">Assessment:</span> {seoAnalysis.keywordDensity.assessment}</p>
                          <p className="text-muted-foreground">{seoAnalysis.keywordDensity.recommendation}</p>
                        </div>
                      </Card>
                    )}

                    {/* Internal Links */}
                    {seoAnalysis.internalLinkSuggestions?.length > 0 && (
                      <Card className="p-4 space-y-3">
                        <h3 className="font-semibold">Internal Linking Opportunities</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {seoAnalysis.internalLinkSuggestions.map((topic: string, idx: number) => (
                            <li key={idx}>{topic}</li>
                          ))}
                        </ul>
                      </Card>
                    )}

                    {/* Content Gaps */}
                    {seoAnalysis.contentGaps?.length > 0 && (
                      <Card className="p-4 space-y-3">
                        <h3 className="font-semibold">Content Gaps to Address</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {seoAnalysis.contentGaps.map((gap: string, idx: number) => (
                            <li key={idx}>{gap}</li>
                          ))}
                        </ul>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={true} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh] p-0 flex flex-col">
          {panelContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-[500px] bg-background border-l shadow-2xl z-50 flex flex-col">
      {panelContent}
    </div>
  );
};
