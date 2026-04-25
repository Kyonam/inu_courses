export interface MenuItem {
  title: string;
  items: string[];
}

export const MENU_DATA: MenuItem[] = [
  {
    title: "기초교양",
    items: ["학문의기초"]
  },
  {
    title: "핵심교양",
    items: [
      "(핵심)INU세미나",
      "(핵심)과학기술",
      "(핵심)사회",
      "(핵심)예술체육",
      "(핵심)외국어",
      "(핵심)인문"
    ]
  },
  {
    title: "심화교양",
    items: ["과학기술", "사회", "예술체육", "외국어", "인문"]
  }
];
