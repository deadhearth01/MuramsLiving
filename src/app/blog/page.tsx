import type { Metadata } from "next";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and stories about student life, working professional accommodation, and living in Visakhapatnam — from the Murams Living blog.",
};

export default function BlogPage() {
  return <BlogPageClient />;
}
