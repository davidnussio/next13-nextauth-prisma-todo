import { env } from "~/env/server.mjs";
import { api, verifyNextAuthCsrfToken } from "../todo/[id]";

export default api()
  .use(verifyNextAuthCsrfToken)
  .post(async (req, res) => {
    const { email } = req.body.email;
    console.log(req.body.recaptcha);

    console.log(env.RECAPTCHA_KEY);
    try {
      const resJson = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_KEY}&response=${req.body.recaptcha}`,
        {
          method: "POST",
        }
      ).then((response) => response.json());

      console.log("resJson", resJson);
    } catch (e) {
      console.log("Error");
      console.log(e);
    }

    // return random 4 digit code
    const code = Math.floor(1000 + Math.random() * 9000);

    console.log("code", code);

    res.json({ email, code });
  });
