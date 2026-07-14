export const CacheKeys = {
  user: {
    public: (userId: string) => `users:publicInfo:userId=${userId}`,
  },
  paste: {
    item: (id: string) => `pastes:item:id=${id}`,
    publicList: (page: number) => `pastes:list:public:page=${page}`,
    publicListAllPages: () => `pastes:list:public:page=*`,
    authorList: (authorId: string, page: number) =>
      `pastes:list:authorId=${authorId}:page=${page}`,
    authorListAllPages: (authorId: string) =>
      `pastes:list:authorId=${authorId}:page=*`,
  },
  comments: {
    list: (pasteId: string, page: number) =>
      `comments:list:paste=${pasteId}:page=${page}`,
    listAllPages: (pasteId: string) => `comments:list:paste=${pasteId}:page=*`,
  },
};
