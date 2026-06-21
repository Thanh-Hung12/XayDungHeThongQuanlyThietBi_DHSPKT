declare module "nodemailer" {
  type TransportOptions = {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user?: string | null;
      pass?: string | null;
    };
  };

  type SendMailOptions = {
    from?: string;
    to?: string;
    subject?: string;
    html?: string;
  };

  type Transporter = {
    sendMail(options: SendMailOptions): Promise<unknown>;
  };

  export function createTransport(options: TransportOptions): Transporter;

  const nodemailer: {
    createTransport(options: TransportOptions): Transporter;
  };

  export default nodemailer;
}
