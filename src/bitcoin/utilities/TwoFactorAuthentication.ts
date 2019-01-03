import crypto from "crypto";
import authenticator from "otplib/authenticator";
import qrcode from "qrcode";
export default class TwoFactorAuthentication {
  constructor() {
    authenticator.options = { crypto };
  }

  public generator = async (
    userID: string,
  ): Promise<{ imageURL: string; secret: number }> => {
    const secret = authenticator.generateSecret(); // base 32 encoded hex secret key
    // const token = authenticator.generate(secret);

    const otpauth = authenticator.keyuri(userID, "BitHyve", secret);
    const imageURL = await qrcode.toDataURL(otpauth);
    return {
      imageURL,
      secret,
    };
  }

  public validator = (secret: string, token: string): boolean =>
    authenticator.verify({ secret, token })
}

// //// SMOKE TEST ///////

// const twoFA = new TwoFactorAuthentication();
// twoFA.generator('parsh.cosmos11@gmail.com').then((res) => {
//   console.log('QR Image URL:\n', res.imageURL);
//   console.log('Secret:\n', res.secret);
// });

// Store the secret corresponding to this user
// const testSecret = "GVKXUQ2UM55G4RRLLBCDA52NJY4WWUTY"; // mocking
// console.log(twoFA.validator(testSecret, process.argv[2]));
