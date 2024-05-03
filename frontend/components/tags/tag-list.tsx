import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { LuChevronsUpDown } from "react-icons/lu";
import { Button } from "../ui/button";
import { AiOutlineClose } from "react-icons/ai";
import { Checkbox } from "../ui/checkbox";
import CreateTag from "./create-tag";
import { FaPlus } from "react-icons/fa";
import getAllTags from "@/lib/tag/getAllTags";
import DropDownSkeleton from "../skeleton/dropdown-skeleton";

export interface TagListProps {
  checkedTags: Array<number>;
  onCheckChanged: (idCate: number) => void;
  onRemove?: (index: number) => void;
  canAdd?: boolean;
  readonly?: boolean;
  isEdit?: boolean;
}

const TagList = ({
  checkedTags,
  canAdd,
  readonly,
  isEdit,
  onCheckChanged,
  onRemove,
}: TagListProps) => {
  const [openTag, setOpenTag] = useState(false);
  const { tags, isLoading, isError, mutate } = getAllTags();
  const handleTagAdded = async (tagId: number) => {
    await mutate();
    onCheckChanged(tagId);
  };
  if (isError) return <div>Failed to load</div>;
  if (isLoading) {
    return <DropDownSkeleton />;
  } else
    return (
      <div className="flex flex-col">
        <div className="flex gap-1">
          <DropdownMenu open={openTag} onOpenChange={setOpenTag}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openTag}
                className="justify-between w-full bg-white"
              >
                Chọn tag
                <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="DropdownMenuContent">
              <Command>
                <CommandInput placeholder="Tìm tên tag" />
                <CommandEmpty className="py-2">
                  <div className="text-sm">Không tìm thấy tag</div>
                </CommandEmpty>
                <CommandGroup className="overflow-y-auto max-h-48">
                  {tags?.data.map((item: any) => (
                    <CommandItem
                      value={item.name}
                      key={item.id}
                      onSelect={() => {
                        if (isEdit !== false) {
                          onCheckChanged(item.id);
                        }
                      }}
                    >
                      <Checkbox
                        className="mr-2"
                        id={item.name}
                        checked={checkedTags.includes(item.id)}
                      ></Checkbox>
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </DropdownMenuContent>
          </DropdownMenu>
          {canAdd && (isEdit === true || isEdit === null) ? (
            <CreateTag handleTagAdded={handleTagAdded}>
              <Button type="button" size={"icon"} className="px-3">
                <FaPlus />
              </Button>
            </CreateTag>
          ) : null}
        </div>
        {isEdit !== null ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {checkedTags.map((tag, index) => (
              <div
                key={tag}
                className="rounded-full flex  px-3 py-1 h-fit outline-none text-sm text-primary  bg-primary/10 items-center gap-1 group"
              >
                {tags?.data.find((item: any) => item.id === tag)?.name}
                <div
                  className={`cursor-pointer w-4 ${isEdit ? "block" : "hidden"
                    }`}
                >
                  <AiOutlineClose className="group-hover:hidden" />
                  <AiOutlineClose
                    color="red"
                    fill="red"
                    className="text-primary group-hover:flex hidden h-4 w-4"
                    onClick={() => {
                      if (onRemove) {
                        onRemove(index);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
};

export default TagList;
