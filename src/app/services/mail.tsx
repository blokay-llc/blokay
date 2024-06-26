import { Resend } from "resend";

const resend = new Resend("re_VAbKegwN_37okwUiqhqagnWLUBq586Jbp");

class Email {
  private sender = "hi@blokay.com";

  async send(to: string, subject: string, component: any, context: any) {
    await resend.emails.send({
      from: this.sender,
      to,
      subject,
      react: component(context),
    });
  }
}

export default Email;
