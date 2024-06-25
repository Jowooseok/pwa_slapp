import React from 'react';
import { CommandInput, Command, CommandList } from '@/shared/components/ui';

interface SearchBarProps {
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  return (
    <div className="">
      <Command className="rounded-full bg-gray-200 px-2">
        <CommandInput placeholder={placeholder} className="h-14 " />
        <CommandList></CommandList>
      </Command>
    </div>
  );
};

export default SearchBar;
