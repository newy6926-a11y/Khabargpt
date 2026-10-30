import { SiteSettings, ContentItem } from '../types';

/**
 * Updates DOM head metadata dynamically according to current settings,
 * route, and optional active article.
 */
export function updateDocumentSEO(
  settings: SiteSettings,
  activeItem?: ContentItem | null,
  customPath?: string
) {
  if (typeof document === 'undefined') return;

  const origin = window.location.origin || '';
  const currentUrl = customPath 
    ? `${origin}${customPath}` 
    : window.location.href;

  // Determine Title
  let title = settings.metaTitle || `${settings.siteTitle} – ${settings.siteSubtitle}`;
  if (activeItem) {
    title = `${activeItem.title} | ${settings.siteTitle}`;
  }
  document.title = title;

  // Determine Description
  let description = settings.metaDescription || settings.introTextNp;
  if (activeItem) {
    description = activeItem.summary || activeItem.seoDescription || description;
  }

  // Determine Keywords
  const keywords = settings.seoKeywords || 'Khabar GPT, Nepal news, current affairs, facebook khabar gpt';

  // Determine OG Title & Description
  const ogTitle = activeItem?.title || settings.ogTitle || title;
  const ogDescription = activeItem?.summary || settings.ogDescription || description;

  // Determine OG Image
  let ogImage = settings.ogImageUrl || '/og-image.png';
  if (activeItem?.featuredImage) {
    ogImage = activeItem.featuredImage;
  }
  // Make absolute if relative
  if (ogImage && ogImage.startsWith('/')) {
    ogImage = `${origin}${ogImage}`;
  }

  // Canonical URL
  const canonicalUrl = settings.canonicalUrl?.trim() || currentUrl;

  // Robots directive
  const robotsContent = settings.disallowSearchIndexing
    ? 'noindex, nofollow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  // Helper to set or create meta tag by name or property
  const setMeta = (attribute: 'name' | 'property', key: string, content: string | undefined) => {
    if (content === undefined || content === null) return;
    let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMeta('name', 'description', description);
  setMeta('name', 'keywords', keywords);
  setMeta('name', 'robots', robotsContent);
  setMeta('name', 'author', settings.authorName || 'Khabar GPT Editorial Desk');

  // Google Site Verification
  if (settings.googleSiteVerification && settings.googleSiteVerification.trim()) {
    setMeta('name', 'google-site-verification', settings.googleSiteVerification.trim());
  }

  // OpenGraph Tags
  setMeta('property', 'og:title', ogTitle);
  setMeta('property', 'og:description', ogDescription);
  setMeta('property', 'og:type', activeItem ? 'article' : (settings.ogType || 'website'));
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:site_name', 'Khabar GPT');
  if (ogImage) {
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:secure_url', ogImage);
    if (!activeItem?.featuredImage) {
      setMeta('property', 'og:image:width', '1200');
      setMeta('property', 'og:image:height', '630');
    }
  }

  // Twitter / X Card
  setMeta('name', 'twitter:card', settings.twitterCard || 'summary_large_image');
  setMeta('name', 'twitter:title', ogTitle);
  setMeta('name', 'twitter:description', ogDescription);
  if (ogImage) {
    setMeta('name', 'twitter:image', ogImage);
  }

  // Canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  // Social Links for Schema.org sameAs (Associates brand with Facebook & social profiles)
  const socialLinks: string[] = [];
  if (settings.facebookUrl) socialLinks.push(settings.facebookUrl);
  if (settings.youtubeUrl) socialLinks.push(settings.youtubeUrl);
  if (settings.whatsappUrl) socialLinks.push(settings.whatsappUrl);

  // Schema.org JSON-LD Structured Data
  let ldJsonScript = document.getElementById('khabar-ld-json') as HTMLScriptElement | null;
  if (!ldJsonScript) {
    ldJsonScript = document.createElement('script');
    ldJsonScript.id = 'khabar-ld-json';
    ldJsonScript.type = 'application/ld+json';
    document.head.appendChild(ldJsonScript);
  }

  const brandAliases = [
    'खबर GPT',
    'KhabarGPT',
    'Khabar Gpt',
    'खबरGPT'
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: 'Khabar GPT',
        alternateName: brandAliases,
        publisher: {
          '@id': `${origin}/#organization`
        },
        inLanguage: 'ne-NP',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${origin}/?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: 'Khabar GPT',
        alternateName: brandAliases,
        url: `${origin}/`,
        logo: {
          '@type': 'ImageObject',
          '@id': `${origin}/#logo`,
          url: `${origin}/logo.png`,
          contentUrl: `${origin}/logo.png`,
          caption: 'Khabar GPT Official Logo',
          inLanguage: 'ne-NP',
          width: 512,
          height: 512
        },
        image: `${origin}/og-image.png`,
        description: description,
        sameAs: socialLinks,
        publishingPrinciples: `${origin}/editorial-standards`,
        correctionsPolicy: `${origin}/corrections`
      }
    ]
  };

  ldJsonScript.textContent = JSON.stringify(structuredData, null, 2);
}
