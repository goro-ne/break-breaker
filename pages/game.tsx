import Konva from "konva";
import { useEffect, useRef, useState } from "react";

const Game = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [status, setStatus] = useState("serve");
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0, dx: 0, dy: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const paddleRef = useRef<Konva.Rect | null>(null);
  const ballRef = useRef<Konva.Circle | null>(null);

  
  useEffect(() => {
    if (containerRef.current) {
      const stage = new Konva.Stage({
        container: containerRef.current,
        width: 500,
        height: 500,
      });  
      const layer = new Konva.Layer();
  
      // フレームの描画
      const frameRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: stage.width(),
        height: stage.height(),
        stroke: "white",
        strokeWidth: 10,
      });
      layer.add(frameRect);
  
      // パドルの描画
      const paddle = new Konva.Rect({
        x: stage.width() / 2 - 50,
        y: stage.height() - 50,
        width: 100,
        height: 10,
        fill: "white",
        cornerRadius: 5,
      });
      paddleRef.current = paddle;
      layer.add(paddle);
  
      // ボールの描画
      const ball = new Konva.Circle({
        x: stage.width() / 2,
        y: stage.height() - 70,
        radius: 7,
        fill: "white",
      });
      ballRef.current = ball;
      layer.add(ball);
  
      // ブロックの描画
      const blocks = [];
      const blockWidth = stage.width() / 10 - 5; // フレーム内に10個のブロックを収めるためにブロックの横幅を調整
      const blockHeight = 15;
      const numBlocksX = 10;
      const numBlocksY = Math.floor(stage.height() / 3 / blockHeight); // ブロックは画面高さの1/3の範囲に表示
      const blockPaddingX = (stage.width() - numBlocksX * blockWidth) / 2;
      const blockPaddingY = 30; // 上部に余白を設ける
      for (let i = 0; i < numBlocksX * numBlocksY; i++) {
        const x = (i % numBlocksX) * blockWidth + blockPaddingX;
        const y = Math.floor(i / numBlocksX) * blockHeight + blockPaddingY;
        const block = new Konva.Rect({
          x,
          y,
          width: blockWidth,
          height: blockHeight,
          fill: Konva.Util.getRandomColor(),
          stroke: "black",
          strokeWidth: 1,
        });
        blocks.push(block);
      }
      layer.add(...blocks);
      stage.add(layer);

      // パドルの移動
      const handleMovePaddle = (event: KeyboardEvent) => {
        if (paddleRef.current) {
          const x = paddleRef.current.x();
          const containerWidth = containerRef.current!.clientWidth;
          const paddleWidth = paddleRef.current.width() / 2;
          if (event.code === "ArrowLeft" && x > 0) { // 左に移動できる場合のみ移動
            paddleRef.current.x(x - 5);
            if (status === "serve") {
              ballRef.current?.x(x - 5 + paddleRef.current.width() / 2); // ボールも一緒に移動
            }
          } else if (event.code === "ArrowRight" && x < stage.width() - (paddleRef.current.width() || 0)) { // 右に移動できる場合のみ移動
            paddleRef.current.x(x + 5);
            if (status === "serve") {
              ballRef.current?.x(x + 5 + paddleRef.current.width() / 2); // ボールも一緒に移動
            }
          }
        }
      };
      // スペースキーが押された時の処理
      const handleSpaceKeyPress = () => {
        if (status === "serve") {
          setStatus("play");
          const paddleX = paddleRef.current?.x() || 0;
          const paddleWidth = paddleRef.current?.width() || 0;
          setBallPosition({
            x: paddleX + paddleWidth / 2,
            y: stage.height() - 77,
            dx: 5,
            dy: -5
          });
        }
      };
      const animate = () => {
        if (status === "play") {
          const ballX = ballRef.current?.x() || 0;
          const ballY = ballRef.current?.y() || 0;
          const dx = ballPosition?.dx;
          const dy = ballPosition?.dy;
          const newX = ballX + dx;
          const newY = ballY + dy;
          if (
            newX + ballRef.current!.radius() > stage.width() ||
            newX - ballRef.current!.radius() < 0
          ) {
            // ボールが左右の壁に衝突した場合
            const newDx = -dx;         
            const newX = ballX + newDx;
            ballRef.current?.position({ x: newX + newDx, y: newY});
            setBallPosition({
              x: newX,
              y: newY,
              dx: newDx,
              dy: dy
            });
          } else if (newY - ballRef.current!.radius() < 0) {
            // ボールが上部に衝突した場合
            ballRef.current?.position({ x: newX, y: newY });
            setScore((prevScore) => prevScore + 1);
          } else if (newY + ballRef.current!.radius() > stage.height()) {
            // ボールがパドルに衝突した場合
            ballY + ballRef.current!.radius() > (paddleRef.current?.y() || 0) &&
              ballX > (paddleRef.current?.x() || 0) &&
              ballX < (paddleRef.current?.x() || 0) + (paddleRef.current?.width() || 0)
          } else {
            ballRef.current?.position({ x: newX, y: newY });
            setScore((prevScore) => prevScore + 1);
          }
        }
        layer.draw();
        requestAnimationFrame(animate);
      };
      document.addEventListener("keydown", handleMovePaddle);
      document.addEventListener("keydown", (event) => {
        if (event.code === "Space") {
          handleSpaceKeyPress();
        }
      });
      animate();
    }
  }, [status]);

  return (
    <div>
      <div>Score: {score}</div>
      <div>Lives: {lives}</div>
      <div ref={containerRef} />
    </div>
  );
};

export default Game;
