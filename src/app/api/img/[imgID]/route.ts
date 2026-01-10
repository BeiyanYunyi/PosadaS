import { notFound } from 'next/navigation';
import db from '@/app/utils/database';

// export const generateStaticParams = async () => {
//   const topics = await db.query.image.findMany({ columns: { imgId: true } });
//   return topics.map((item) => ({ imgID: item.imgId }));
// };

export const GET = async (
  _request: Request,
  props: { params: Promise<{ imgID: string }> },
) => {
  const params = await props.params;
  const { imgID } = params;
  const img = await db.query.image.findFirst({
    where: { imgId: imgID },
    columns: { imgContent: true },
  });
  if (!img?.imgContent) notFound();

  return new Response(img.imgContent as Buffer<ArrayBuffer>, {
    // Although some file's extension is .webp, Douban doesn't serve webp actually. All of them are jpg.
    headers: { 'Content-Type': 'image/jpeg' },
  });
};
