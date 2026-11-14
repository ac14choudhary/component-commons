import type { ReactNode } from "react";
import type { ExampleLayout } from "@/components/design-system/docs/ComponentExample";

// Common fields for a documented component.

export type PropDoc = [name: string, type: string, defaultValue: string, description: string];
export type ApiDoc = { name: string; description: string; props: PropDoc[] };
export type Example = {
  id: string;
  title: string;
  description?: string;
  code: string;
  layout?: ExampleLayout;
  preview: ReactNode;
};

export type DocBody = {
  slug: string;
  name: string;
  description: string;
  source: string[];
  importCode: string;
  usage: string;
  composition?: string;
  api: ApiDoc[];
  examples: Example[];
  guidelines?: [title: string, body: string][];
};
