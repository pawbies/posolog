// Everything related to the wiki

import CoreConcepts from "@/components/wiki/core-concepts";
import {
  AreaChart,
  ArrowLeftRight,
  Atom,
  Boxes,
  ChartNoAxesCombined,
  ChartScatter,
  ChartSpline,
  Clock,
  Droplet,
  Droplets,
  FlaskConical,
  HeartPulse,
  Magnet,
  Microscope,
  Repeat,
  Scale,
  Share2,
  SlidersHorizontal,
  TestTubeDiagonal,
  TrendingDown,
  type LucideIcon,
} from "lucide-react-native";
import { type ComponentType } from "react";

// A single article
export type WikiArticle = {
  slug: string;
  title: string;
  headerTitle?: string;
  icon: LucideIcon;
  body?: ComponentType;
};

// A wiki section
export type WikiSection = {
  group?: string;
  title: string;
  path: string;
  articles: WikiArticle[];
};

// The sections and articles, optional body with the content if its available
export const WIKI_SECTIONS: WikiSection[] = [
  {
    title: "Basic pharmacology",
    path: "Basic pharmacology",
    articles: [
      { slug: "core-concepts", title: "Core concepts", icon: Microscope, body: CoreConcepts },
      { slug: "common-terminology", title: "Common terminology", icon: TestTubeDiagonal },
    ],
  },
  {
    group: "Pharmacokinetics",
    title: "Processes - ADME",
    path: "PK / ADME",
    articles: [
      { slug: "absorption", title: "Absorption", icon: Droplet },
      { slug: "distribution", title: "Distribution", icon: Share2 },
      { slug: "metabolism", title: "Metabolism", icon: FlaskConical },
      { slug: "excretion", title: "Excretion", icon: Droplets },
    ],
  },
  {
    title: "Modeling and simulation - M&S",
    path: "PK / M&S",
    articles: [
      { slug: "compartment-modeling", title: "Compartment modeling", icon: Boxes },
      { slug: "non-compartment-analysis", title: "Non-compartment analysis - NCA", headerTitle: "Non-compartment analysis", icon: AreaChart },
      { slug: "pbpk", title: "Physiologically based PK - PBPK", headerTitle: "PBPK", icon: HeartPulse },
      { slug: "pop-pk", title: "Population PK - popPK", headerTitle: "popPK", icon: ChartScatter },
      { slug: "linear-nonlinear-kinetics", title: "Linear vs. nonlinear kinetics", icon: ChartSpline },
      { slug: "multiple-dose-kinetics", title: "Multiple-dose kinetics", icon: Repeat },
    ],
  },
  {
    group: "Pharmacodynamics",
    title: "Mechanism",
    path: "PD / Mechanism",
    articles: [
      { slug: "receptor-theory", title: "Receptor theory", icon: Atom },
      { slug: "agonism-antagonism", title: "Agonism and antagonism", icon: ArrowLeftRight },
      { slug: "affinity-efficacy", title: "Affinity and efficacy", icon: Magnet },
    ],
  },
  {
    title: "Quantitative response",
    path: "PD / Quantitative response",
    articles: [
      { slug: "emax-hill-models", title: "Emax and Hill models", icon: ChartNoAxesCombined },
      { slug: "potency-vs-efficacy", title: "Potency vs. efficacy", icon: Scale },
      { slug: "therapeutic-window", title: "Therapeutic window", icon: SlidersHorizontal },
      { slug: "effect-delay", title: "Effect delay", icon: Clock },
      { slug: "tolerance", title: "Tolerance", icon: TrendingDown },
    ],
  },
];

export function findWikiArticle(slug: string) {
  for (const section of WIKI_SECTIONS) {
    const article = section.articles.find((a) => a.slug === slug);
    if (article) return { section, article };
  }
}
