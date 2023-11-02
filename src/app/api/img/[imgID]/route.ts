import prisma from '@/app/utils/database';
import { notFound } from 'next/navigation';

export const GET = async (_request: Request, { params }: { params: { imgID: string } }) => {
  const { imgID } = params;
  const img = await prisma.image.findFirst({
    where: { imgID },
    select: { imgContent: true },
  });
  if (!img?.imgContent) notFound();
  return new Response(img.imgContent, {
    // Although some file's extension is .webp, Douban doesn't serve webp actually. All of them are jpg.
    headers: { 'Content-Type': 'image/jpeg' },
  });
};
