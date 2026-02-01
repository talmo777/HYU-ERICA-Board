export type Category = "교내 공모전" | "서포터즈" | "IC-PBL" | "대외활동";

export interface Contest {
  id: string;
  title: string;
  organizer: string;
  category: Category;
  start_date?: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
  deadline: string;    // YYYY-MM-DD
  tags: string[];
  target: string;
  summary: string;
  source_url: string;
  apply_url: string;
  imageUrl?: string; // Optional cover image
}

export interface NavItem {
  label: string;
  path: string;
}
