export interface HeroStat { value: string; suffix: string; label: string; }
export interface HeroButton { text: string; link: string; }
export interface HeroSectionData {
  badge: string;
  line1: string;
  line2: string;
  desc: string;
  stats: HeroStat[];
  primaryBtn: HeroButton;
  secondaryBtn: HeroButton;
}

export interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}
export interface ServicesSectionData {
  tag: string;
  title: string;
  desc: string;
  services: ServiceCard[];
}

export interface StatItem { value: number; suffix: string; label: string; }
export interface StatsSectionData {
  items: StatItem[];
}

export interface TestimonialItem { quote: string; author: string; role: string; initials: string; }
export interface TestimonialsSectionData {
  tag: string;
  title: string;
  desc: string;
  testimonials: TestimonialItem[];
}

export interface ClientsSectionData {
  tag: string;
  title: string;
  logos: string[];
}

export interface CtaSectionData {
  title: string;
  desc: string;
  btnText: string;
  btnLink: string;
}
