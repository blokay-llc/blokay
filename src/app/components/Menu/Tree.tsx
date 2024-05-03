"use client";
import { useState, useEffect } from "react";
import { AppIcon } from "@/app/components/DS/Index";

const DropItem = function ({
  editMode = "",
  level = 1,
  item,
  keyNeuron = null,
  defaultOpen = false,
  onClickNeuron = null,
}: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <div className="flex flex-col ">
        <div
          className={`flex items-center justify-between py-1 ${
            item.key ? "bg-stone-100 hover:bg-stone-200" : ""
          }`}
          style={{ paddingLeft: level * 15 }}
        >
          <div
            className="flex items-center gap-1"
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
                  className={`fill-stone-600 size-4 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
              </div>
            )}
            <div className={`text-sm ${level == 0 ? "font-bold" : ""}`}>
              {item?.name}
            </div>
          </div>
          <div>
            {keyNeuron && (
              <AppIcon icon="component" className={`size-4 fill-indigo-600`} />
            )}
          </div>
        </div>
        {isOpen && item?.children?.length > 0 && (
          <div className="flex flex-col ">
            {item.children.map((item: any) => (
              <DropItem
                editMode={editMode}
                level={level + 1}
                item={item}
                key={item.id}
                keyNeuron={item.key}
                onClickNeuron={onClickNeuron}
              />
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
  const inLayout = (n: any) => {
    if (!view?.layout?.length) return false;
    return view.layout.find((l: any) => l.i == n.id);
  };
  return (
    <div>
      <div className="px-2 select-none flex flex-col">
        {buildStructure().map((item: any) => (
          <DropItem
            onClickNeuron={onClickNeuron}
            defaultOpen={false}
            level={0}
            item={item}
            key={item.id}
            editMode={editMode}
          />
        ))}
      </div>
    </div>
  );
};

export default TreeMenu;
