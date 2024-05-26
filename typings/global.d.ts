declare interface Document {
  startViewTransition?: () => any;
}

declare module "markdown-it-table-of-contents";
declare module "lodash-es";
declare module 'markdown-it-textual-uml';
declare module 'markdown-it';
declare module 'diacritics';

declare interface FrontmatterPostType {
  title: string;
  description: string;
  tags?: string[];
  categories?: string;
  date: string;
  image?: string;
  plum?: boolean;
}

interface AlgoliaSearchParams {
  appId: string;
  apiKey: string;
  siteId: string;
  branch: string;
  selector: string;
}

declare module "@docsearch/js";
