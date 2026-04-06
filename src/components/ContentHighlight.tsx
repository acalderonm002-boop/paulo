import VideoFeature from "./VideoFeature";

export default function ContentHighlight() {
  return (
    <VideoFeature
      background="white"
      tagline="CONTENIDO"
      title="Los mejores consejos del mundo inmobiliario"
      video={{
        kind: "file",
        src: "/images/videos/paulo-tip-1.mp4",
      }}
      reverse
    />
  );
}
