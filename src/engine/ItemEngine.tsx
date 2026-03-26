import { useItems } from "../context/Items";

import { getItemComponent } from "../objects/map/items/Props";

export default function ItemEngine() {
  const { Items, setWorldItems } = useItems();


  return (
    <>
      {Items?.map((item) => {
        const ItemComponent = getItemComponent(item.id);
        if (!ItemComponent) {
          return null;
        }
        return <ItemComponent key={item.mapId} data={item}  />;
      })}
    </>
  );
}
