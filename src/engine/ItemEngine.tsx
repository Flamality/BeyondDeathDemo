import { useItems } from '../context/Items';

import * as Props from "../objects/map/items/Props";

export default function ItemEngine() {
    const {Items} = useItems();

  return (
    <>
        {Items.map((item, _) => {
            const ItemComponent = (Props as any)[item.id];
            return (
            <>
                <ItemComponent key={item.mapId} data={item} />
            </>
            )
        })}
    </> 
  )
}
