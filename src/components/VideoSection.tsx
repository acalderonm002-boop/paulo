import VideoFeature from "./VideoFeature";

export default function VideoSection() {
  return (
    <VideoFeature
      background="cream"
      tagline="CONÓCEME"
      title="Me dedico a encontrar la mejor propiedad para tu empresa o para tu familia."
      subtext="Estoy a tus órdenes para dar el siguiente paso."
      video={{
        kind: "file",
        src: "/images/videos/paulo-intro.mp4",
      }}
    />
  );
}
