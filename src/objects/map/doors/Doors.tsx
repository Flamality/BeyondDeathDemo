import React from 'react';
import Door from './Door';
const Doors: React.FC = () => {
  return (
    <>
        {/* <Door position={[1, 0, 3]} locked={true} itemRequired='Box2' takeItem={true} /> */}
        <Door position={[0, 0, 6.5]} rotation={90} />

        <Door position={[0, 0, -3.5]} rotation={90} />

        <Door position={[-4, 0, 6.5]} rotation={-90} />

        <Door position={[-4, 0, -3.5]} rotation={-90} />

    </>
  );
};

export default Doors;