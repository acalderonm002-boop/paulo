import VideoFeature from "./VideoFeature";
import { DEFAULT_CONFIG, type SiteConfig } from "@/lib/content";

type Props = { config?: SiteConfig };

export default function ContentHighlight({
  config = DEFAULT_CONFIG,
}: Props = {}) {
  const src = config.content_section_url ?? "/images/videos/paulo-tip-1.mp4";
  const isIframe = /youtube\.com|youtu\.be|vimeo\.com/i.test(src);

  return (
    <VideoFeature
      background="white"
      tagline={config.content_section_tagline}
      title={config.content_section_title}
      video={
        isIframe
          ? { kind: "iframe", src, title: "Consejos del mundo inmobiliario" }
          : { kind: "file", src }
      }
      reverse
    />
  );
}
