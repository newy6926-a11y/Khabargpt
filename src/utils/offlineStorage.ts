import { ContentItem, SavedArticleItem } from '../types';

const OFFLINE_KEY = 'khabar_offline_articles_v1';

export const offlineStorage = {
  getSavedArticles(): SavedArticleItem[] {
    try {
      const data = localStorage.getItem(OFFLINE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Failed to read offline articles:', e);
      return [];
    }
  },

  isSaved(articleId: string): boolean {
    const list = this.getSavedArticles();
    return list.some((item) => item.id === articleId);
  },

  saveArticle(article: ContentItem): boolean {
    try {
      const list = this.getSavedArticles();
      if (list.some((item) => item.id === article.id)) return true;

      const itemToSave: SavedArticleItem = {
        id: article.id,
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        body: article.body,
        category: article.category,
        featuredImage: article.featuredImage,
        author: article.author,
        savedAt: new Date().toISOString()
      };

      list.unshift(itemToSave);
      // Keep max 50 articles in local cache
      const trimmed = list.slice(0, 50);
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(trimmed));
      return true;
    } catch (e) {
      console.warn('Failed to save article offline:', e);
      return false;
    }
  },

  removeArticle(articleId: string): boolean {
    try {
      const list = this.getSavedArticles();
      const filtered = list.filter((item) => item.id !== articleId);
      localStorage.setItem(OFFLINE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.warn('Failed to remove offline article:', e);
      return false;
    }
  },

  clearAll(): void {
    try {
      localStorage.removeItem(OFFLINE_KEY);
    } catch {}
  }
};
