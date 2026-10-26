// The project map's tilted orbit (feature 007 Revision 2). Positions are percentages of the
// orbit box; depth is -1 (far side, top) to 1 (near side, bottom). Shared by the server (static
// positions, used without JavaScript or motion) and the client (revolution).
export const ORBIT = { rx: 32, ry: 26 } as const;

export function baseAngle(index: number, count: number): number {
  return -90 + (index * 360) / count;
}

export function orbitPoint(angleDegrees: number) {
  const angle = (angleDegrees * Math.PI) / 180;
  const round = (value: number) => Math.round(value * 100) / 100;
  return {
    x: round(50 + ORBIT.rx * Math.cos(angle)),
    y: round(50 + ORBIT.ry * Math.sin(angle)),
    depth: round(Math.sin(angle)),
  };
}
