import Konva from "konva";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const BlockBreakerTitleScreen = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const stage = new Konva.Stage({
        container: containerRef.current,
        width: 500,
        height: 500,
      });

      const layer = new Konva.Layer();

      const text = new Konva.Text({
        x: stage.width() / 2,
        y: stage.height() / 2,
        text: "Block Breaker",
        fontSize: 50,
        fontFamily: "Arial",
        fill: "white",
        align: "center",
      });
      text.offsetX(text.width() / 2);
      text.offsetY(text.height() / 2);
      layer.add(text);

      const startButton = new Konva.Rect({
        x: stage.width() / 2 - 50,
        y: stage.height() / 2 + 50,
        width: 100,
        height: 50,
        fill: "green",
        cornerRadius: 10,
      });
      const startButtonText = new Konva.Text({
        x: startButton.x() + startButton.width() / 2,
        y: startButton.y() + startButton.height() / 2,
        text: "START",
        fontSize: 20,
        fontFamily: "Arial",
        fill: "white",
        align: "center",
      });
      startButtonText.offsetX(startButtonText.width() / 2);
      startButtonText.offsetY(startButtonText.height() / 2);
      layer.add(startButton, startButtonText);

      startButton.on("click", () => {
        router.push("/game");
      });

      stage.add(layer);
    }
  }, [router]);

  return <div ref={containerRef} />;
};

export default BlockBreakerTitleScreen;
