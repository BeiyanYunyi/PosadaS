import prisma from '@/app/utils/database';
import { notFound } from 'next/navigation';

export const GET = async (_request: Request, { params }: { params: { imgID: string } }) => {
  const { imgID } = params;
  const img = await prisma.image.findFirst({
    where: { imgID },
    select: { imgContent: true },
  });
  if (!img) notFound();
  return new Response(img.imgContent, {
    headers: { 'Content-Type': 'image/jpeg' },
  });
};
