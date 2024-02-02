import db from '@/app/utils/database';
import { image } from '@drizzle/schema/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export const GET = async (_request: Request, { params }: { params: { imgID: string } }) => {
  const { imgID } = params;
  const img = await db.query.image.findFirst({
    where: eq(image.imgId, imgID),
    columns: { imgContent: true },
  });
  if (!img?.imgContent) notFound();
  return new Response(img.imgContent, {
    // Although some file's extension is .webp, Douban doesn't serve webp actually. All of them are jpg.
    headers: { 'Content-Type': 'image/jpeg' },
  });
};
