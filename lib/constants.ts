import {
  Book,
  Calculator,
  Database,
  CircuitBoard,
  Speech,
  LineChart,
  Code,
  Server,
  BarChart2,
  HardDrive,
  FlaskConical,
  FolderTree,
  Terminal,
  BookA,
  ClipboardList,
  BookOpen,
  School,
  FileCheck,
} from "lucide-react";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce store built with Next.js";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const signInDefaultValues = {
  name: "Oussama Najih",
  password: "Gv8$kLp@12!",
};

export const matieresWithIcons = [
  { name: "Anglais", icon: Book, href: "/matieres/anglais" },
  {
    name: "Comptabilité Générale",
    icon: Calculator,
    href: "/matieres/comptabilite_generale",
  },
  {
    name: "Bases de Données",
    icon: Database,
    href: "/matieres/base_De_Donnéés",
  },
  {
    name: "Electronique Analogique 2",
    icon: CircuitBoard,
    href: "/matieres/electronique_analogique_2",
  },
  { name: "TEC 2", icon: Speech, href: "/matieres/tec_2" },
  { name: "Analyse 4", icon: LineChart, href: "/matieres/analyse_4" },
  {
    name: "Programmation Web",
    icon: Code,
    href: "/matieres/programmation_web",
  },
  {
    name: "Informatique Industrielle",
    icon: Server,
    href: "/matieres/informatique_industrielle_labview",
  },
  {
    name: "Programmation Avancée & Structure de Données 2",
    icon: FolderTree,
    href: "/matieres/TP_structure_donnees_2",
  },
  { name: "Statistique", icon: BarChart2, href: "/matieres/statistique" },
  {
    name: "Systèmes D’Exploitation 2",
    icon: HardDrive,
    href: "/matieres/systemes_exploitation_2",
  },
];

export const categories = [
  { name: "Toutes_les_categories", icon: null }, // Represents photos or images
  { name: "COURS", icon: BookA }, // Represents photos or images
  { name: "CONTROLES", icon: ClipboardList }, // Represents tests or checklists
  { name: "EXAMENS", icon: FileCheck }, // Represents written documents
  { name: "TDS", icon: BookOpen }, // Represents theoretical work/study
  { name: "TPS", icon: FlaskConical }, // Represents lab experiments
];

export const subjectsWithIcons = [
  { name: "Toutes_les_matieres", icon: School },
  { name: "ANGLAIS", icon: Book },
  { name: "COMPTABILITE_GENERALE", icon: Calculator },
  { name: "BASES_DE_DONNEES", icon: Database },
  { name: "ELECTRONIQUE_ANALOGIQUE_2", icon: CircuitBoard },
  { name: "TEC_2", icon: Speech },
  { name: "ANALYSE_4", icon: LineChart },
  { name: "PROGRAMMATION_WEB", icon: Code },
  { name: "INFORMATIQUE_INDUSTRIELLE", icon: Server },
  { name: "STRUCTURE_DONNEES_2", icon: FolderTree },
  { name: "STATISTIQUE", icon: BarChart2 },
  { name: "SYSTEMES_EXPLOITATION_2", icon: HardDrive },
];
