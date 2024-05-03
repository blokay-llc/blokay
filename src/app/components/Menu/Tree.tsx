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
}: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isFound, setIsFound] = useState(false);

  useEffect(() => {
    if (search && item?.name) {
      let s = search.toLowerCase();
      let name = item.name.toLowerCase();
      let found = name.includes(s);
      setIsOpen(found);
      setIsFound(found);
      onFound && onFound(found);
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
            item.key ? "bg-stone-100 hover:bg-stone-200" : ""
          }`}
          onClick={() => {
            if (item.key) {
              onClickNeuron(item);
            }
          }}
          draggable={editMode === "grid" && !!item.key}
          unselectable="on"
          onDragStart={(e) => {
            if (item.key) {
              e.dataTransfer.setData("text/plain", "" + item?.id);
            }
          }}
          style={{ paddingLeft: level * 15 }}
        >
          <div className="flex items-center gap-1">
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
                  className={`fill-stone-600 size-4 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </div>
            )}
            <div
              className={`text-sm text-stone-600 ${
                level == 0 ? "font-medium" : "font-light"
              }`}
            >
              <span className={`${isFound ? "font-bold text-indigo-600" : ""}`}>
                {item?.name}
              </span>
            </div>
          </div>
          <div>
            {item.key && (
              <AppIcon icon="component" className={`size-4 fill-indigo-600`} />
            )}
          </div>
        </div>
        {isOpen && item?.children?.length > 0 && (
          <div className="flex flex-col ">
            {item.children.map((child: any) => (
              <>
                {child?.id && (
                  <DropItem
                    editMode={editMode}
                    level={level + 1}
                    item={child}
                    key={"child+" + child.id}
                    onClickNeuron={onClickNeuron}
                    search={search}
                    onFound={(found: boolean) => {
                      onFound && onFound(found);
                    }}
                  />
                )}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const TreeMenu = function ({
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

  const nonUse = function () {
    let list = neurons.slice(0);

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
    return list.filter((n: any) => !arr.includes(+n.id));
  };
  const inLayout = (n: any) => {
    if (!view?.layout?.length) return false;
    return view.layout.find((l: any) => l.i == n.id);
  };

  const nonUsed = nonUse();

  return (
    <div>
      <div className="px-2 select-none flex flex-col pt-3 border-t border-stone-200">
        {buildStructure().map((item: any) => (
          <DropItem
            onClickNeuron={onClickNeuron}
            defaultOpen={false}
            level={0}
            item={item}
            key={item.id}
            editMode={editMode}
            search={search}
          />
        ))}
      </div>

      {nonUsed.length > 0 && (
        <div className="px-2 select-none flex flex-col pt-3 mt-3 border-t border-stone-200">
          <h2 className="text-stone-600 mb-3 text-sm font-medium">
            Unused yet
          </h2>
          {nonUsed.map((item: any) => (
            <DropItem
              onClickNeuron={onClickNeuron}
              defaultOpen={false}
              level={0}
              item={item}
              key={item.id}
              editMode={editMode}
              search={search}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeMenu;
