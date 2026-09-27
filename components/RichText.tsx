import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

// Styles for everything the Studio's default rich-text editor can produce.
// Tailwind's typography plugin isn't installed, so each element is styled here.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-text-primary text-base leading-relaxed mb-6">{children}</p>
    ),
    h1: ({ children }) => (
      <h2 className="font-heading font-bold text-3xl text-primary-blue mt-10 mb-4">{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className="font-heading font-bold text-2xl text-primary-blue mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading font-bold text-xl text-text-primary mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading font-semibold text-lg text-text-primary mt-6 mb-3">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-yellow bg-yellow-light/50 px-5 py-3 mb-6 italic text-text-secondary">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-text-primary leading-relaxed">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-text-primary leading-relaxed">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => <s>{children}</s>,
    code: ({ children }) => (
      <code className="rounded bg-bg-light px-1.5 py-0.5 text-sm">{children}</code>
    ),
    link: ({ value, children }) => {
      const href: string = value?.href ?? "";
      const className =
        "text-primary-blue underline underline-offset-2 hover:text-primary-dark";

      if (href.startsWith("/")) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      );
    },
  },
};

export default function RichText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
