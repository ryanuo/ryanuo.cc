declare interface Document {
  startViewTransition?: () => any;
}

declare module "markdown-it-table-of-contents";
declare module "lodash-es";

declare interface FrontmatterPostType {
  title: string;
  description: string;
  tags?: string[];
  categories?: string;
  date: string;
  image?: string;
  plum?: boolean;
}
