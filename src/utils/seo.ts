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
  let ogImage = settings.ogImageUrl || settings.customLogoUrl || '/logo.svg';
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
  setMeta('name', 'author', settings.authorName || 'Khabar GPT');

  // Google Site Verification
  if (settings.googleSiteVerification && settings.googleSiteVerification.trim()) {
    setMeta('name', 'google-site-verification', settings.googleSiteVerification.trim());
  }

  // OpenGraph Tags
  setMeta('property', 'og:title', ogTitle);
  setMeta('property', 'og:description', ogDescription);
  setMeta('property', 'og:type', activeItem ? 'article' : (settings.ogType || 'website'));
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('property', 'og:site_name', settings.facebookPageName || settings.siteTitle || 'Khabar GPT');
  if (ogImage) {
    setMeta('property', 'og:image', ogImage);
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
  if (settings.tiktokUrl) socialLinks.push(settings.tiktokUrl);
  if (settings.instagramUrl) socialLinks.push(settings.instagramUrl);
  if (settings.twitterUrl) socialLinks.push(settings.twitterUrl);
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
    'KhabarGPT',
    'Khabar Gpt',
    'Khabar gpt',
    'khabar gpt',
    'खबर GPT',
    'खबरGPT',
    'Khabar GPT Nepal',
    'KhabarGPT Nepal',
    'Khabar GPT Official'
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: 'Khabar GPT',
        alternateName: brandAliases,
        publisher: {
          '@id': `${origin}/#organization`
        },
        inLanguage: 'ne-NP',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/news?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'NewsMediaOrganization',
        '@id': `${origin}/#organization`,
        name: 'Khabar GPT',
        alternateName: brandAliases,
        url: origin,
        logo: {
          '@type': 'ImageObject',
          '@id': `${origin}/#logo`,
          url: `${origin}/logo.png`,
          contentUrl: `${origin}/logo.png`,
          caption: 'Khabar GPT Logo',
          inLanguage: 'ne-NP',
          width: 512,
          height: 512
        },
        image: `${origin}/logo.png`,
        description: description,
        sameAs: socialLinks,
        publishingPrinciples: `${origin}/editorial-standards`,
        correctionsPolicy: `${origin}/corrections`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'editorial inquiries',
          email: settings.contactEmail || undefined,
          telephone: settings.contactPhone || undefined
        }
      }
    ]
  };

  ldJsonScript.textContent = JSON.stringify(structuredData, null, 2);
}
