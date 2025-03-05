import { fetchApi } from '@/services/utlis/fetchApi';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  const fileType = file.type.startsWith('image/')
    ? 'imagefile'
    : file.type.startsWith('audio/')
    ? 'audiofile'
    : 'file';

  formData.append(fileType, file);

  const response = await fetchApi('/files', {
    method: 'POST',
    body: formData
  });

  if (response.success) {
    return (
      response.result.audioFileUrl ||
      response.result.imageFileUrl ||
      response.result.fileUrl
    );
  } else {
    throw new Error(response.message || 'File Upload Failed');
  }
};

export const processNestedFields = async (content: any): Promise<any> => {
  console.log('processNestedFields 1', content);
  const result = { ...content };
  console.log('processNestedFields', result);
  for (const key of Object.keys(content || {})) {
    if (content[key] instanceof File) {
      // First priority: Check if it's a File
      result[key] = await uploadFile(content[key]);
    } else if (content[key]?.name && content[key]?.type && content[key]?.size) {
      // Fallback for manual File-like checks
      result[key] = await uploadFile(content[key]);
    } else if (typeof content[key] === 'object' && content[key] !== null) {
      // Recursive processing for nested objects
      result[key] = await processNestedFields(content[key]);
    }
  }

  return result;
};
