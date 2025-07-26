import AWS from "aws-sdk";
AWS.config.update({
  credentials: {
    accessKeyId: process.env.ACCESSKEYID!,
    secretAccessKey: process.env.SCERTKEYID!,
  },
  region: "ap-south-1",
});
export const ses = new AWS.SES();

export const sendEmail = async (
  email: string,
  subject: string,
  template: string
) => {
  try {
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: template,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: "letscode@lets-code.co.in",
    };

    await ses.sendEmail(params).promise();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
