type EventMap = {
  hover: { uuid: string; };
  unhover: { uuid: string; };
  itemClicked: { uuid: string;};
  doorInteract: { uuid: string };
};

type EventKey = keyof EventMap;
type Listener<K extends EventKey> = (payload: EventMap[K]) => void;

class EventBus {
  private listeners: {
    [K in EventKey]?: Set<Listener<K>>;
  } = {};

  on<K extends EventKey>(event: K, callback: Listener<K>) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set() as any;
    }

    this.listeners[event]!.add(callback as any);

    return () => {
      this.listeners[event]!.delete(callback as any);
    };
  }

  emit<K extends EventKey>(event: K, payload: EventMap[K]) {
    if (!this.listeners[event]) return;

    for (const callback of this.listeners[event]!) {
      (callback as Listener<K>)(payload);
    }
  }
}

export const eventBus = new EventBus();