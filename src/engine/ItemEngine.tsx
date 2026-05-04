import { useItems } from "../context/Items";

import {
  getItemComponent,
  useItemCatalogVersion,
} from "../objects/map/items/PropCatalog";

export default function ItemEngine() {
  const { Items } = useItems();
  useItemCatalogVersion();


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
