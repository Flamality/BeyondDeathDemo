import React, { useEffect, useState } from 'react'
import { getItemComponent, itemById } from '../objects/map/items/Props';
import { useConsole } from '../context/Console';
import { useItems } from '../context/Items';



export default function Dev_placepreview() {
    const { rawItems, setRawItems, updateMap} = useItems();
    const [snap, setSnap] = useState<number | null>(0.1);

    const [rotSnap , setRotSnap] = useState<number | null>(1);

    const [pos, setPos] = useState([0, 0, 0]);
    const [rot, setRot] = useState([0, 0, 0]);

    const [rotAxis, setRotAxis] = useState(1);
    const [mode, setMode] = useState("1"); 
    // 0 = none, 1 = place, 2=delete

    const [currentItem, setCurrentItem] = useState("bed");
    const [Icomponent, setComponent] = useState<React.ComponentType<any> | null>(null);

    const { consoleLog } = useConsole();
    useEffect(() => {
        if (mode === "0") return;
        if (mode === "2") {
            

            return
        }
        // consoleLog("Pos: [" + pos[0].toPrecision(2) + ", " + pos[1].toPrecision(2) + ", " + pos[2].toPrecision(2) + "]");
        // consoleLog("Rot: [" + rot[0].toPrecision(2) + ", " + rot[1].toPrecision(2) + ", " + rot[2].toPrecision(2) + "]");
        const handleButtonClick = (e: any) => {
            // Move Fowards
            if (e.key === "ArrowUp") {
                setPos([pos[0] - (snap || 0.2), pos[1], pos[2]]);
            }
            // Move Backwards
            if (e.key === "ArrowDown") {
                setPos([pos[0] + (snap || 0.2), pos[1], pos[2]]);
            }
            // Move Left
            if (e.key === "ArrowLeft") {
                setPos([pos[0], pos[1], pos[2] + (snap || 0.2)]);
            }
            // Move Right
            if (e.key === "ArrowRight") {
                setPos([pos[0], pos[1], pos[2] - (snap || 0.2)]);
            }
            // Rotate Clockwise
            if (e.key === "r") {
                const newRot = [...rot];
                newRot[rotAxis] += rotSnap || 15;
                setRot(newRot);
            }
            // Rotate Counter Clockwise
            if (e.key === "f") {
                const newRot = [...rot];
                newRot[rotAxis] -= rotSnap || 15;
                setRot(newRot);
            }
            // Change Rotation Axis
            if (e.key === "g") {
                setRotAxis((rotAxis + 1) % 3);
            }
            // Move Up
            if (e.key === "o") {
                setPos([pos[0], pos[1] + (snap || 0.2), pos[2]]);
            }
            // Move Down
            if (e.key === "l") {
                setPos([pos[0], pos[1] - (snap || 0.2), pos[2]]);
            }
            // Change Object
            if (e.key === "p") {
                const i = Object.keys(itemById).indexOf(currentItem);
                const nextItem = Object.keys(itemById)[(i + 1) % Object.keys(itemById).length];
                setCurrentItem(nextItem);
                const ItemComponent = getItemComponent(nextItem);
                if (ItemComponent) {
                    setComponent(() => ItemComponent);
                }
            }

            if (e.key ==="m") {
                setMode((parseInt(mode) + 1) % 3 + "");
            }

            if (e.key === "Enter") {
                const temp = rawItems;
                temp.push({
                    "item": currentItem,
                    "pos": pos,
                    "rot": rot,
                })
                setRawItems(temp);
                updateMap();
                navigator.clipboard.writeText(JSON.stringify(temp));
                consoleLog("Added " + currentItem + " to map at position [" + pos[0].toPrecision(2) + ", " + pos[1].toPrecision(2) + ", " + pos[2].toPrecision(2) + "] with rotation [" + rot[0].toPrecision(2) + ", " + rot[1].toPrecision(2) + ", " + rot[2].toPrecision(2) + "]");
            }
        }

        document.addEventListener("keydown", handleButtonClick)
        return () => {
            document.removeEventListener("keydown", handleButtonClick);
        }
    }, [rot,  pos, snap, rotAxis, currentItem])

    return (
        <group>
            {Icomponent && <Icomponent key={"preview__item"} data={{
                id: "bed",
                mapId: "preview-bed",
                position: pos,
                rotation: rot,
                noRigid: true,
            }} />}
        </group>
    )
}
