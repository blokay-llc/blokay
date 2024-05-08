"use client";
import { useState, useEffect } from "react";
import { AppIcon } from "@/app/components/DS/Index";

const DropItem = function ({
  editMode = "",
  level = 1,
  item,
  defaultOpen = false,
  onFound = null,
  onClickNeuron = null,
  search = "",
  view = null,
}: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isFound, setIsFound] = useState(false);

  const propogateOpen = (open = true) => {
    setIsOpen(open);
    setIsFound(open);
    onFound && onFound(open);
  };

  useEffect(() => {
    if (view?.id == item.id) {
      propogateOpen();
    }
  }, []);

  useEffect(() => {
    if (view?.id == item.id) {
      propogateOpen();
    }
  }, [view]);

  useEffect(() => {
    if (search && item?.name) {
      let s = search.toLowerCase();
      let name = item.name.toLowerCase();
      let found = name.includes(s);

      propogateOpen(found);
    } else {
      setIsOpen(defaultOpen);
      setIsFound(false);
    }
  }, [search]);

  return (
    <div>
      <div className="flex flex-col ">
        <div
          className={`flex items-center justify-between py-1 ${
            item.key
              ? "bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-900"
              : ""
          }`}
          onClick={() => {
            if (item.key) {
              onClickNeuron(item.id);
            }
          }}
          draggable={
            editMode === "edit" && !!item.key && item.type == "function"
          }
          unselectable="on"
          onDragStart={(e) => {
            if (item.key) {
              e.dataTransfer.setData("text/plain", "" + item?.id);
            }
          }}
        >
          <div
            className="flex items-center gap-1"
            style={{ paddingLeft: level * 22 }}
          >
            {item?.children?.length > 0 && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
              >
                <AppIcon
                  icon="right"
                  className={`fill-stone-600 dark:fill-stone-200 size-4 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </div>
            )}
            <div
              className={`text-[13px] text-stone-600 dark:text-stone-300 ${
                level == 0 ? "font-medium" : "font-light"
              }`}
            >
              <span className={`${isFound ? "font-bold " : ""}`}>
                {item?.name}
              </span>
            </div>
          </div>
          <div>
            {item.key && item.type == "function" && (
              <AppIcon
                icon="component"
                className={`size-4 fill-stone-600 dark:fill-stone-200`}
              />
            )}
            {item.key && item.type == "cron" && (
              <AppIcon
                icon="clock"
                className={`size-5 fill-yellow-700 dark:fill-yellow-500`}
              />
            )}
          </div>
        </div>
        {item?.children?.length > 0 && (
          <div className={`${isOpen ? "flex" : "hidden"} flex-col `}>
            {item.children
              .filter((c: any) => c?.id)
              .map((child: any, index: any) => (
                <DropItem
                  editMode={editMode}
                  level={level + 1}
                  item={child}
                  view={view}
                  key={`child-${index}-${item.id}-${child.id}`}
                  onClickNeuron={onClickNeuron}
                  search={search}
                  onFound={(found: boolean) => {
                    setIsOpen(found);
                    onFound && onFound(found);
                  }}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default function TreeMenu({
  views = [],
  onClickNeuron,
  view,
  search,
  neurons,
  editMode,
}: any) {
  const buildStructure = function () {
    if (!neurons.length) return [];
    if (!views.length) return [];
    const map: any = {};
    for (let neuron of neurons) {
      map[neuron.id] = neuron;
    }

    for (let neuron of neurons) {
      neuron.children = [];
      for (let childId of neuron.childrenIds) {
        neuron.children.push(map[childId]);
      }
      map[neuron.id] = neuron;
    }

    for (let viewGroupIndex in views) {
      let viewGroup = views[viewGroupIndex];
      viewGroup.name = viewGroup.name || "Views";

      viewGroup.children = viewGroup.Views;
      for (let viewIndex in viewGroup.children) {
        let view = viewGroup.children[viewIndex];

        for (let childNeuronIndex in view.children) {
          let neuronId = view.children[childNeuronIndex];
          if (map[neuronId]?.id) {
            view.children[childNeuronIndex] = map[neuronId];
          }
        }
      }
    }
    return views;
  };

  const getOthers = function () {
    let list = neurons.filter((n: any) => n.type == "function").slice(0);
    let crons = neurons.filter((n: any) => n.type == "cron").slice(0);
    let use = new Set();
    // add subneurons
    for (let n of neurons) {
      for (let neuronId of n.childrenIds) {
        use.add(+neuronId);
      }
    }

    for (let cat of views) {
      for (let view of cat.Views) {
        for (let neuron of view.children) {
          let id = neuron?.id || neuron;
          use.add(+id);
        }
      }
    }

    let arr = Array.from(use);
    arr = list.filter((n: any) => !arr.includes(+n.id));

    return { nonUsed: arr, crons };
  };

  const { nonUsed, crons } = getOthers();

  return (
    <div className={`${editMode == "user" ? "hidden" : ""}`}>
      <div className="px-2 select-none flex flex-col pt-3 border-t border-stone-200 dark:border-black">
        {buildStructure().map((item: any, index: any) => (
          <DropItem
            onClickNeuron={onClickNeuron}
            defaultOpen={false}
            level={0}
            item={item}
            key={`s-${index}-${item.id}`}
            editMode={editMode}
            search={search}
            view={view}
          />
        ))}
      </div>

      {nonUsed.length > 0 && (
        <div className="px-2 select-none flex flex-col pt-3 mt-3 border-t border-stone-200 dark:border-black">
          <h2 className="text-stone-600 dark:text-white mb-3 text-sm font-medium">
            Unused yet
          </h2>
          {nonUsed.map((item: any, index: any) => (
            <DropItem
              onClickNeuron={onClickNeuron}
              defaultOpen={false}
              level={0}
              item={item}
              key={`non-${index}-${item.id}`}
              editMode={editMode}
              search={search}
            />
          ))}
        </div>
      )}

      {crons.length > 0 && (
        <div className="px-2 select-none flex flex-col pt-3 mt-3 border-t border-stone-200 dark:border-black">
          <h2 className="text-stone-600 dark:text-white mb-3 text-sm font-medium">
            Cron Jobs
          </h2>
          {crons.map((item: any, index: any) => (
            <DropItem
              onClickNeuron={onClickNeuron}
              defaultOpen={false}
              level={0}
              item={item}
              key={`crons-${index}-${item.id}`}
              editMode={editMode}
              search={search}
            />
          ))}
        </div>
      )}
    </div>
  );
}
