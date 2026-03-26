import React from "react";
import Wall from "./Wall";

export default function WallMap() {
  return (
    <>
      {/* Room M223 */}
      <Wall position={[4, 0, 0]} width={8} />
      <Wall position={[8, 0, 5]} length={10} />
      <Wall position={[4, 0, 10]} width={8} />
      <Wall position={[0, 0, 2.75]} length={5.5} />
      <Wall position={[0, 0, 8.75]} length={2.5} />

      {/* Room M221 */}
      <Wall position={[8, 0, -5]} length={10} />
      <Wall position={[4, 0, -10]} width={8} />
      <Wall position={[0, 0, -7.25]} length={5.5} />
      <Wall position={[0, 0, -1.25]} length={2.5} />

      {/* Room M222 */}
      <Wall position={[-8, 0, 0]} width={8} />
      <Wall position={[-12, 0, 5]} length={10} />
      <Wall position={[-8, 0, 10]} width={8} />
      <Wall position={[-4, 0, 2.75]} length={5.5} />
      <Wall position={[-4, 0, 8.75]} length={2.5} />

      {/* Room M220 */}
      <Wall position={[-12, 0, -5]} length={10} />
      <Wall position={[-8, 0, -10]} width={8} />
      <Wall position={[-4, 0, -7.25]} length={5.5} />
      <Wall position={[-4, 0, -1.25]} length={2.5} />
    </>
  );
}
