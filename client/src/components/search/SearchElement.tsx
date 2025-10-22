import React from "react";
import Card from "../ui/Card";
import Link from "next/link";
import { Search } from "@/types/search";
import { getAvatarUrl } from "@/lib/getAvatarUrl";
import { removeSearch } from "@/store/searches";
import { MdClose } from "react-icons/md";
import Avatar from "../ui/Avatar";
import IconButton from "../ui/IconButton";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useDropdown } from "../ui/dropdown";

type SearchElementProps = {
  search: Search | Omit<Search, "id">;
  onClick?: () => void;
};

function SearchElement({ search, onClick = () => null }: SearchElementProps) {
  const dispatch = useAppDispatch();
  const { close } = useDropdown();
  return (
    <Card className="hover:bg-primary-500 p-0">
      <div className="flex items-center gap-2">
        <Link
          href={search.href}
          className="flex items-center gap-2 p-2 flex-1"
          onMouseDown={() => {
            onClick();
            close();
          }}
        >
          {search.type === "USER" && (
            <Avatar url={getAvatarUrl(search.avatarUrl)} alt={search.content} />
          )}
          <span className="truncate">{search.content}</span>
        </Link>
        {"id" in search && (
          <IconButton
            type="button"
            variant="ghost"
            className="ml-auto"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              dispatch(removeSearch(search.id));
            }}
          >
            <MdClose />
          </IconButton>
        )}
      </div>
    </Card>
  );
}

export default SearchElement;
