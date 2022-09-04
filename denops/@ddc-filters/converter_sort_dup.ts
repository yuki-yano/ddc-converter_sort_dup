import {
  BaseFilter,
  Context,
  Item,
} from "https://deno.land/x/ddc_vim@v2.3.1/types.ts";
import { Denops } from "https://deno.land/x/denops_core@v3.1.0/denops.ts";

type Params = Record<never, never>;

const swap = (items: Item[], i: number, j: number) => {
  const tmp = items[i];
  items[i] = items[j];
  items[j] = tmp;

  return items;
};

export class Filter extends BaseFilter<Params> {
  async filter(args: {
    denops: Denops;
    context: Context;
    completeStr: string;
    items: Item[];
  }): Promise<Item[]> {
    const priority = ["vim-lsp", "around"];

    let { items } = args;
    for (const item of items) {
      const dupItems = Object.entries(items).map(([i, v]) => [i, v]).filter((
        [i, v],
      ) => v.word === item.word);

      if (dupItems.length <= 1) break;

      for (const dupItem of dupItems) {
        const [i, v] = dupItem;
        const dupPriority = priority.indexOf(v.__sourceName as string);
        const itemPriority = priority.indexOf(item.__sourceName as string);

        if (dupPriority <= itemPriority) {
          items = swap(items, Number(i), items.indexOf(item));
        }
      }
    }

    return await Promise.resolve(items);
  }

  params(): Params {
    return {};
  }
}
