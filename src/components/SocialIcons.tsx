"use client";

import { Facebook, Instagram, Linkedin, type LucideIcon } from "lucide-react";

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/paulolealsav/",
  facebook:
    "https://www.facebook.com/people/Paulo-Leal-Bienes-Ra%C3%ADces/61572709677439/",
  tiktok: "https://www.tiktok.com/@paulolealsav",
  linkedin: "https://www.linkedin.com/in/paulo-leal-savi%C3%B1on",
} as const;

export function TikTokIcon({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.6 6.3a5.4 5.4 0 0 1-3.3-1.1 5.3 5.3 0 0 1-2-3.2h-3.4v13.5a2.5 2.5 0 1 1-2.5-2.5c.2 0 .5 0 .7.1V9.7a6 6 0 0 0-.7 0 5.9 5.9 0 1 0 5.9 5.9V9.3a8.7 8.7 0 0 0 5.3 1.8V7.7a5.4 5.4 0 0 1 0-1.4Z" />
    </svg>
  );
}

type SocialEntry = {
  name: string;
  href: string;
  icon: LucideIcon | "tiktok";
};

export const SOCIALS: SocialEntry[] = [
  { name: "Instagram", href: SOCIAL_LINKS.instagram, icon: Instagram },
  { name: "Facebook", href: SOCIAL_LINKS.facebook, icon: Facebook },
  { name: "TikTok", href: SOCIAL_LINKS.tiktok, icon: "tiktok" },
  { name: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: Linkedin },
];

export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
};

type SocialIconsProps = {
  size?: number;
  gapClass?: string;
  linkClass?: string;
  links?: SocialLinks;
};

export default function SocialIcons({
  size = 20,
  gapClass = "gap-5",
  linkClass = "text-[color:var(--text-secondary)] hover:text-[color:var(--accent)]",
  links,
}: SocialIconsProps) {
  const resolved: SocialEntry[] = [
    {
      name: "Instagram",
      href: links?.instagram || SOCIAL_LINKS.instagram,
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: links?.facebook || SOCIAL_LINKS.facebook,
      icon: Facebook,
    },
    {
      name: "TikTok",
      href: links?.tiktok || SOCIAL_LINKS.tiktok,
      icon: "tiktok",
    },
    {
      name: "LinkedIn",
      href: links?.linkedin || SOCIAL_LINKS.linkedin,
      icon: Linkedin,
    },
  ];

  return (
    <div className={`flex items-center ${gapClass}`}>
      {resolved.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className={`${linkClass} transition-colors duration-300`}
        >
          {s.icon === "tiktok" ? (
            <TikTokIcon size={size} />
          ) : (
            <s.icon size={size} />
          )}
        </a>
      ))}
    </div>
  );
}
