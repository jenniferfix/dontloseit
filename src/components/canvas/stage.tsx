import React from "react";
import { Circle, Stage as KonvaStage, Layer } from "react-konva";

export const Stage = () => {
	const sceneWidth = 1000;
	const sceneHeight = 1000;

	const [stageSize, setStageSize] = React.useState({
		width: sceneWidth,
		height: sceneHeight,
		scale: 1,
	});
	const containerRef = React.useRef<HTMLDivElement>(null);

	const updateSize = React.useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const scale = Math.min(
			container.offsetWidth / sceneWidth,
			container.offsetHeight / sceneHeight,
		);

		setStageSize({
			width: sceneWidth * scale,
			height: sceneHeight * scale,
			scale,
		});
	}, []);

	React.useEffect(() => {
		updateSize();
		window.addEventListener("resize", updateSize);

		return () => {
			window.removeEventListener("resize", updateSize);
		};
	}, [updateSize]);

	return (
		<div ref={containerRef} style={{ width: "100%", height: "100%" }}>
			<KonvaStage
				width={stageSize.width}
				height={stageSize.height}
				scaleX={stageSize.scale}
				scaleY={stageSize.scale}
			>
				<Layer>
					<Circle radius={65} fill="red" x={sceneWidth / 2} y={sceneHeight / 2} />
				</Layer>
			</KonvaStage>
		</div>
	);
};
