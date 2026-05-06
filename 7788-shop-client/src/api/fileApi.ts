import api from './axios';

export const fileApi = {
  upload: (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/files/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
