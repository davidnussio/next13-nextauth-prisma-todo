import Script from "next/script";
import React from "react";
import { Button } from "~/ui/button";
import { FormInput } from "~/ui/form-input";
import { env } from "~/env/client.mjs";

export default function EmailInput({ onSubmit }) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    grecaptcha.ready(function () {
      grecaptcha
        .execute(env.NEXT_PUBLIC_RECAPTCHA_KEY, {
          action: "submit",
        })
        .then(function (recaptcha) {
          // Add your logic to submit to your backend server here.
          const form = event.target;
          const email = form.elements.namedItem(
            "email-for-verification-code"
          ) as HTMLInputElement;
          onSubmit({ email: email.value, recaptcha });
        });
    });
  };
  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${env.NEXT_PUBLIC_RECAPTCHA_KEY}`}
      />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <FormInput
            label="Email address for verification code  "
            id="email-for-verification-code"
            name="email-for-verification-code"
            type="email"
            autoComplete="email"
            required
          />
          <div className="">
            <Button type="submit" className="w-full">
              Get verification code
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
