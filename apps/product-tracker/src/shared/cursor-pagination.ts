export type CursorResponse<T> = {
  data: T[];
  nextCursor: string | undefined;
  total: number;
};

export const createCursorResponse = <T>(
  data: T[],
  total: number,
): CursorResponse<T> => {
  return {
    data,
    total,
    nextCursor: data.length ? (data[data.length - 1] as any).id : undefined,
  };
}