import { image } from '@drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { db } from './database';

const getImgID = (imgURL: string) => {
  const imgURLStrAry = imgURL.replace('.webp', '').replace('.jpg', '').split('/');
  return imgURLStrAry[imgURLStrAry.length - 1].substring(1);
};

const getImgURL = async (imgURL: string) => {
  if (imgURL.includes('uploads')) return imgURL;
  const imgID = getImgID(imgURL);
  const img = await db.query.image.findFirst({
    where: eq(image.imgId, imgID),
    columns: { imgId: true },
  });
  if (img) return `/api/img/${imgID}`;
  return imgURL;
};

export default getImgURL;
