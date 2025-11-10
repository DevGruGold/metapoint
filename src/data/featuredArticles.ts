// Featured Articles with Direct Links
// These will be displayed on Home page and Archive page until imported to database

export interface FeaturedArticle {
  id: string;
  title: string;
  excerpt: string;
  external_link: string;
  published_date: string;
  category: string;
  author: string;
  featured_image?: string;
}

export const featuredArticles: FeaturedArticle[] = [
  {
    id: 'black-swan-coronavirus',
    title: 'Is the Coronavirus the Black Swan to Trigger a "Black Bat" Market Crash?',
    excerpt: 'As the coronavirus spreads globally, markets face unprecedented uncertainty. This analysis examines whether COVID-19 represents the black swan event that could trigger a market correction of historic proportions.',
    external_link: 'https://myemail.constantcontact.com/Is-the-Coronavirus-the-Black-Swan-to-Trigger-a--Black-Bat--Market-Crash-.html?soid=1129654521375&aid=aDXOnYGp0CE',
    published_date: '2020-03-01',
    category: 'Market Analysis',
    author: 'Maya Joelson',
    featured_image: 'https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'world-war-iii',
    title: 'What if We Are on the Brink of World War III? Why Isn\'t the West Doing Anything About It?',
    excerpt: 'Geopolitical tensions are at their highest in decades. This piece explores the escalating global conflicts and questions why Western powers appear to be taking a passive stance in the face of potential worldwide conflict.',
    external_link: 'https://myemail.constantcontact.com/What-if-We-Are-on-the-Brink-of-World-War-III--Why-Isn-t-the-West-Doing-Anything-About-It-.html?soid=1129654521375&aid=oFSkxpaDEas',
    published_date: '2022-03-15',
    category: 'Geopolitical Analysis',
    author: 'Maya Joelson',
    featured_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'ides-of-march',
    title: 'Beware the Ides of March',
    excerpt: 'Historical patterns suggest March can be a pivotal month for markets. Drawing on lessons from the past, this analysis warns investors to be vigilant as we approach critical market junctures.',
    external_link: 'https://www.metapointadvisors.com/beware-the-ides-of-march-',
    published_date: '2023-03-10',
    category: 'Investment Insights',
    author: 'Maya Joelson',
    featured_image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'esg-diversity',
    title: 'Can You Rely on "Socially Responsible" ESG Funds to Invest in Companies that Promote Diversity?',
    excerpt: 'ESG investing has exploded in popularity, but are these funds actually delivering on their promises? This investigation examines whether ESG funds truly promote diversity and social responsibility, or if it\'s just marketing.',
    external_link: 'https://myemail.constantcontact.com/Can-You-Rely-on--Socially-Responsible--ESG-Funds-to-Invest-in-Companies-that-Promote-Diversity-.html?soid=1129654521375&aid=4VC54h7jBqg',
    published_date: '2023-06-20',
    category: 'ESG & Sustainable Investing',
    author: 'Maya Joelson',
    featured_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'china-portfolio-impact',
    title: 'Do You Really Know What\'s Happening in China and How it Affects Your Portfolio?',
    excerpt: 'As Chinese stocks plummet, it\'s tempting to jump in at cheap valuations. But China\'s recent crackdown on public companies marks a major shift in priorities with permanent implications for emerging market holdings in your portfolio.',
    external_link: 'https://myemail.constantcontact.com/Do-You-Really-Know-What-s-Happening-in-China-and-How-it-Affects-Your-Portfolio-.html?soid=1129654521375&aid=kHSV0KstB1M',
    published_date: '2021-08-15',
    category: 'International Markets',
    author: 'Maya Joelson',
    featured_image: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'powell-brainard-fed',
    title: 'My "Meeting" With Fed Chairman Powell and My Rare Bond With Lael Brainard',
    excerpt: 'A personal account of understanding the Federal Reserve\'s decision-making through direct observation and shared educational background. Insights into Powell\'s leadership during market crises and Biden\'s Fed Chair choice between Powell and Brainard.',
    external_link: 'https://myemail.constantcontact.com/My--Meeting--With-Fed-Chairman-Powell-and-My-Rare-Bond-With-Lael-Brainard.html?soid=1129654521375&aid=pxaDnE2WUkU',
    published_date: '2021-11-10',
    category: 'Federal Reserve & Monetary Policy',
    author: 'Maya Joelson',
    featured_image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'selective-strategic-investing',
    title: 'Smart Investors Aren\'t Buying the Market - They\'re Being Selective and Strategic',
    excerpt: 'In volatile times, conventional wisdom says to stick with whole-market ETFs. But smart investors know better. Learn why strategic stock picking with proper diversification can dramatically outperform "the market" - and how one Stanford professor turned $10K into $2M.',
    external_link: 'https://myemail.constantcontact.com/Smart-Investors-Aren-t-Buying-the-Market---They-re-Being-Selective-and-Strategic.html?soid=1129654521375&aid=8kObjeX07Qw',
    published_date: '2020-10-20',
    category: 'Investment Strategy',
    author: 'Maya Joelson',
    featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
  }
];
