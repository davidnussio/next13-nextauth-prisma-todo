import { cn } from "~/lib/utils";

type Props = JSX.IntrinsicElements["input"] & {
  label: React.ReactNode;
};

export const FormInput = ({ id, label, className, ...props }: Props) => {
  return (
    <>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="mt-1">
        <input
          className={cn(
            "w-full rounded-md border border-white/40 bg-white/10 p-2 text-white"
          )}
          id={id}
          {...props}
        />
      </div>
    </>
  );
};
