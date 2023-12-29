export interface Page<TEntity> {
  entities: TEntity[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function emptyPage<TEntity>(): Page<TEntity> {
  return {
    entities: [],
    page: 1,
    pageSize: 1,
    total: 0,
    totalPages: 1,
  };
}

export function TransformPage<TOriginal, TTarget>(
  originalPage: Page<TOriginal>,
  fromApi: boolean,
  transformation: (original: TOriginal) => TTarget,
): Page<TTarget> {
  return <Page<TTarget>>{
    entities: originalPage.entities.map((e) => transformation(e)),
    page: originalPage.page + (fromApi ? 1 : 0),
    pageSize: originalPage.pageSize,
    total: originalPage.total,
    totalPages: originalPage.totalPages,
  };
}
