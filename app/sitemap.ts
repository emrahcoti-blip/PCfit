import { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pcfit.io";
  return ["", "/about", "/contact", "/disclosure", "/privacy", "/terms"].map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : 0.5,
  }));
}
