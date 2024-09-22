import { currentUser } from '@/lib/user.auth';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

const getUser = async () => await currentUser();
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
      return { uploadedBy: metadata.userId, imageURL: file.url };
    }),
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const user = await getUser();
      if (!user) throw new UploadThingError('Unauthorized');
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);

      console.log('file url', file.url);
      return { uploadedBy: metadata.userId, pdfURL: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
