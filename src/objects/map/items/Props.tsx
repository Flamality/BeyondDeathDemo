import { Outlines } from "@react-three/drei"
import type { ItemsList } from "../../../context/Items"
import Item from "./Item"

import {Box as DreiBox} from '@react-three/drei'

export const Box = ({ data }: {data: ItemsList}) => {
    return (
    <Item id={data.id} mapId={data.mapId} position={data.position || [0, 1, 0]} gravity={false} grabbable={true}>
            <DreiBox position={data.position || [0, 1, 0]} args={[0.2, 0.2, 3]}>
                <meshStandardMaterial color={'blue'} />
            </DreiBox>
    </Item>
    )
}

export const Box2 = ({ data }: {data: ItemsList}) => {
    return (
    <Item id={data.id} mapId={data.mapId} position={data.position || [0, 1, 0]} gravity={true} grabbable={true}>
        <DreiBox position={data.position || [0, 1, 0]} args={[1, 1, 1]}>
            <meshStandardMaterial color={'red'} />
        </DreiBox>
    </Item>
    )
}