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
}

export const featuredArticles: FeaturedArticle[] = [
  {
    id: 'black-swan-coronavirus',
    title: 'Is the Coronavirus the Black Swan to Trigger a "Black Bat" Market Crash?',
    excerpt: 'As the coronavirus spreads globally, markets face unprecedented uncertainty. This analysis examines whether COVID-19 represents the black swan event that could trigger a market correction of historic proportions.',
    external_link: 'https://myemail.constantcontact.com/Is-the-Coronavirus-the-Black-Swan-to-Trigger-a--Black-Bat--Market-Crash-.html?soid=1129654521375&aid=aDXOnYGp0CE',
    published_date: '2020-03-01',
    category: 'Market Analysis',
    author: 'Maya Joelson'
  },
  {
    id: 'world-war-iii',
    title: 'What if We Are on the Brink of World War III? Why Isn\'t the West Doing Anything About It?',
    excerpt: 'Geopolitical tensions are at their highest in decades. This piece explores the escalating global conflicts and questions why Western powers appear to be taking a passive stance in the face of potential worldwide conflict.',
    external_link: 'https://myemail.constantcontact.com/What-if-We-Are-on-the-Brink-of-World-War-III--Why-Isn-t-the-West-Doing-Anything-About-It-.html?soid=1129654521375&aid=oFSkxpaDEas',
    published_date: '2022-03-15',
    category: 'Geopolitical Analysis',
    author: 'Maya Joelson'
  },
  {
    id: 'ides-of-march',
    title: 'Beware the Ides of March',
    excerpt: 'Historical patterns suggest March can be a pivotal month for markets. Drawing on lessons from the past, this analysis warns investors to be vigilant as we approach critical market junctures.',
    external_link: 'https://www.metapointadvisors.com/beware-the-ides-of-march-',
    published_date: '2023-03-10',
    category: 'Investment Insights',
    author: 'Maya Joelson'
  },
  {
    id: 'esg-diversity',
    title: 'Can You Rely on "Socially Responsible" ESG Funds to Invest in Companies that Promote Diversity?',
    excerpt: 'ESG investing has exploded in popularity, but are these funds actually delivering on their promises? This investigation examines whether ESG funds truly promote diversity and social responsibility, or if it\'s just marketing.',
    external_link: 'https://myemail.constantcontact.com/Can-You-Rely-on--Socially-Responsible--ESG-Funds-to-Invest-in-Companies-that-Promote-Diversity-.html?soid=1129654521375&aid=4VC54h7jBqg',
    published_date: '2023-06-20',
    category: 'ESG & Sustainable Investing',
    author: 'Maya Joelson'
  }
];
