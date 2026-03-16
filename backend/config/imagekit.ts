import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY || '',
  privateKey: process.env.PRIVATE_KEY || '',
  urlEndpoint: `https://ik.imagekit.io/${process.env.ImagekitID}`,
});

export default imagekit;
