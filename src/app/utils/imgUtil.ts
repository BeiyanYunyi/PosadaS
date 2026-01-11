export const getImgID = (imgURL: string) => {
  const imgURLStrAry = new URL(imgURL).pathname.split('/');
  return imgURLStrAry[imgURLStrAry.length - 1];
};

/** @deprecated no longer need img in db */
export const getDBImgID = (imgURL: string) => {
  const imgURLStrAry = imgURL
    .replace('.webp', '')
    .replace('.jpg', '')
    .split('/');
  return imgURLStrAry[imgURLStrAry.length - 1].substring(1);
};

const getImgURL = async (imgURL: string) => {
  if (imgURL.includes('uploads')) return imgURL;
  const imgID = getImgID(imgURL);
  const ossURL = new URL(imgID, process.env.IMAGE_SERVE_URL).toString();
  const res = await fetch(ossURL, { method: 'HEAD' });
  const img = res.ok;

  if (img) return ossURL;
  return imgURL;
};

export default getImgURL;
