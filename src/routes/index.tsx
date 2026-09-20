import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/beyond/Header";
import { Hero } from "@/components/beyond/Hero";
import { About, Industries, Process, Services, Statement } from "@/components/beyond/EditorialSections";
import { Portfolio } from "@/components/beyond/Portfolio";
import { CustomCursor } from "@/components/beyond/CustomCursor";
import { Contact, Footer, TestimonialFaq } from "@/components/beyond/ContactFooter";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Beyond — Branding, Design & Print Studio in Rajkot" },
    { name: "description", content: "Beyond is an independent creative studio in Rajkot building distinctive brand identities, packaging, campaigns and print experiences." },
    { property: "og:title", content: "Beyond — Creative Direction, Branding & Print" },
    { property: "og:description", content: "Ideas shaped to go beyond. Distinctive identities, packaging and print for ambitious businesses." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});
function Index(){return <><CustomCursor/><Header/><main><Hero/><Statement/><About/><Services/><Portfolio/><Process/><Industries/><TestimonialFaq/><Contact/></main><Footer/></>}
