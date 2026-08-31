import React from "react";

interface CustomInputProps {
  customInput: string;
  setCustomInput: (value: string) => void;
}

export default function CustomInput({ customInput, setCustomInput }: CustomInputProps) {
  return (
    <div className="flex flex-col w-full">
      <textarea
        rows={5}
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder="Set custom input"
        className="focus:outline-none w-full border border-input bg-background rounded-md px-4 py-2 mt-2 placeholder-muted-foreground resize-none"
      ></textarea>
    </div>
  );
}