import { Button } from "~/ui/button";
import { FormInput } from "~/ui/form-input";

export default function EmailInput({ onSubmit, code }: any) {
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    const verificationCode = form.elements.namedItem(
      "verficication-code"
    ) as HTMLInputElement;
    onSubmit({ verificationCode: verificationCode.value });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput
          label="Verification code"
          id="verficication-code"
          name="verficication-code"
          type="text"
          required
          defaultValue={code}
        />
        <div className="">
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </div>
    </form>
  );
}
