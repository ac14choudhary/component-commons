import type { CustomerStory } from "@/components/collected/CustomerStories";

export const sampleStories: CustomerStory[] = [
  {
    company: "Orbit Studio",
    mark: "Orbit",
    title: "A shared brief for every project",
    logo: { src: "/demo/marks/orbit.webp", width: 64, height: 64 },
    summary: "A small production studio put client notes, references, and delivery dates in a single project brief.",
    highlight: "The same brief follows each project from the first call through the final delivery.",
    stats: [
      { value: "3", label: "project stages" },
      { value: "1", label: "shared brief" },
    ],
    person: { name: "Studio team", role: "Project operations", initials: "OS" },
    href: "/demo/customer-stories#orbit",
  },
  {
    company: "Folio Press",
    mark: "Folio",
    title: "A clearer path to publication",
    logo: { src: "/demo/marks/folio.webp", width: 64, height: 64 },
    summary: "An independent publisher built a single review queue for manuscripts and illustrations.",
    highlight: "Editors can see what is ready for review and what still needs a revision.",
    stats: [
      { value: "4", label: "review stages" },
      { value: "2", label: "editorial teams" },
    ],
    person: { name: "Editorial team", role: "Production", initials: "FP" },
    href: "/demo/customer-stories#folio",
  },
  {
    company: "Relay Labs",
    mark: "Relay",
    title: "Fewer handoffs between teams",
    logo: { src: "/demo/marks/relay.webp", width: 64, height: 64 },
    summary: "A software team introduced a shared checklist for product releases.",
    highlight: "Each task has an owner and a visible completion status.",
    stats: [
      { value: "6", label: "release checks" },
      { value: "3", label: "teams in the pilot" },
    ],
    person: { name: "Release team", role: "Engineering operations", initials: "RL" },
    href: "/demo/customer-stories#relay",
  },
  {
    company: "Fieldwork",
    mark: "Fieldwork",
    title: "One record for each delivery",
    logo: { src: "/demo/marks/fieldwork.webp", width: 64, height: 64 },
    summary: "A distribution team replaced scattered updates with a record that follows each delivery.",
    highlight: "Dispatchers can check the current status and the next planned stop.",
    stats: [
      { value: "3", label: "delivery status views" },
      { value: "2", label: "dispatch teams" },
    ],
    person: { name: "Dispatch team", role: "Logistics", initials: "FW" },
    href: "/demo/customer-stories#fieldwork",
  },
];
