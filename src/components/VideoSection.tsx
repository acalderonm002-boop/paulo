import VideoFeature from "./VideoFeature";
import { DEFAULT_CONFIG, type SiteConfig } from "@/lib/content";

type Props = { config?: SiteConfig };

export default function VideoSection({
  config = DEFAULT_CONFIG,
}: Props = {}) {
  const src = config.video_section_url ?? "/images/videos/paulo-intro.mp4";
  const isIframe = /youtube\.com|youtu\.be|vimeo\.com/i.test(src);

  return (
    <VideoFeature
      background="cream"
      tagline={config.video_section_tagline}
      title={config.video_section_title}
      subtext={config.video_section_subtitle}
      video={
        isIframe
          ? { kind: "iframe", src, title: "Conoce a Paulo Leal" }
          : { kind: "file", src }
      }
    />
  );
}
